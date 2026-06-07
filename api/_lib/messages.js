const { getDb, ObjectId } = require("./mongodb");

const collectionMap = {
  contact: ["contact_messages", "contactMessages"],
  hire: ["hire_requests", "hireRequests"],
};

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 50;
const SEARCH_FIELDS = ["name", "email", "phone", "subject", "message", "projectType", "budget", "timeline", "company"];
const VALID_STATUSES = new Set(["new", "read", "replied", "archived"]);

const getCollectionNames = (type) => {
  const collectionNames = collectionMap[type];
  if (!collectionNames) {
    const error = new Error("Invalid message type.");
    error.statusCode = 400;
    throw error;
  }
  return collectionNames;
};

const getPrimaryCollectionName = (type) => getCollectionNames(type)[0];

const formatMessage = (document) => ({
  id: document._id.toString(),
  source: document.source,
  status: document.status || (document.read ? "read" : "new"),
  name: document.name,
  email: document.email,
  phone: document.phone || "",
  subject: document.subject || "",
  company: document.company || "",
  projectType: document.projectType || "",
  budget: document.budget || "",
  timeline: document.timeline || "",
  message: document.message,
  userAgent: document.userAgent || "",
  ipAddress: document.ipAddress || "",
  createdAt: document.createdAt instanceof Date ? document.createdAt.toISOString() : new Date(document.createdAt).toISOString(),
  updatedAt: document.updatedAt instanceof Date ? document.updatedAt.toISOString() : new Date(document.updatedAt || document.createdAt).toISOString(),
});

const normalizeStatus = (status) => {
  if (!status) return "";
  if (!VALID_STATUSES.has(status)) {
    const error = new Error("Invalid status filter.");
    error.statusCode = 400;
    throw error;
  }
  return status;
};

const buildFilters = ({ status, search, dateFrom, dateTo }) => {
  const query = {};
  const normalizedStatus = normalizeStatus(status);

  if (normalizedStatus) {
    query.status = normalizedStatus;
  }

  if (search) {
    query.$or = SEARCH_FIELDS.map((field) => ({
      [field]: { $regex: search, $options: "i" },
    }));
  }

  if (dateFrom || dateTo) {
    query.createdAt = {};
    if (dateFrom) {
      query.createdAt.$gte = new Date(dateFrom);
    }
    if (dateTo) {
      const endDate = new Date(dateTo);
      endDate.setHours(23, 59, 59, 999);
      query.createdAt.$lte = endDate;
    }
  }

  return query;
};

const normalizePagination = ({ page, limit, sort }) => {
  const normalizedPage = Math.max(Number.parseInt(page || DEFAULT_PAGE, 10) || DEFAULT_PAGE, 1);
  const normalizedLimit = Math.min(Math.max(Number.parseInt(limit || DEFAULT_LIMIT, 10) || DEFAULT_LIMIT, 1), MAX_LIMIT);
  const normalizedSort = sort === "oldest" ? 1 : -1;

  return {
    page: normalizedPage,
    limit: normalizedLimit,
    sort: normalizedSort,
  };
};

const fetchFromCollections = async (db, type, query, sortDirection) => {
  const collectionNames = getCollectionNames(type);
  const results = await Promise.all(
    collectionNames.map((collectionName) =>
      db.collection(collectionName).find(query).sort({ createdAt: sortDirection }).toArray().catch(() => [])
    )
  );

  return results.flat().map(formatMessage);
};

const paginateMessages = (messages, page, limit) => {
  const total = messages.length;
  const totalPages = Math.max(Math.ceil(total / limit), 1);
  const start = (page - 1) * limit;
  const entries = messages.slice(start, start + limit);

  return {
    entries,
    pagination: {
      total,
      page,
      limit,
      totalPages,
      hasNext: page < totalPages,
      hasPrevious: page > 1,
    },
  };
};

const listMessages = async ({ type = "all", status = "", search = "", page = DEFAULT_PAGE, limit = DEFAULT_LIMIT, sort = "newest", dateFrom = "", dateTo = "" }) => {
  const db = await getDb();
  const query = buildFilters({ status, search, dateFrom, dateTo });
  const { page: normalizedPage, limit: normalizedLimit, sort: sortDirection } = normalizePagination({ page, limit, sort });

  if (type === "all") {
    const [contactEntries, hireEntries] = await Promise.all([
      fetchFromCollections(db, "contact", query, sortDirection),
      fetchFromCollections(db, "hire", query, sortDirection),
    ]);

    const combined = [...contactEntries, ...hireEntries].sort((left, right) => {
      const delta = new Date(left.createdAt).getTime() - new Date(right.createdAt).getTime();
      return sortDirection === 1 ? delta : -delta;
    });

    return paginateMessages(combined, normalizedPage, normalizedLimit);
  }

  const formatted = await fetchFromCollections(db, type, query, sortDirection);
  return paginateMessages(formatted, normalizedPage, normalizedLimit);
};

const createMessage = async (type, payload) => {
  const db = await getDb();
  const collectionName = getPrimaryCollectionName(type);
  const now = new Date();
  const document = {
    ...payload,
    source: type === "contact" ? "contact" : "hire-me",
    status: "new",
    createdAt: now,
    updatedAt: now,
  };

  const result = await db.collection(collectionName).insertOne(document);
  console.info("[mongodb] Insert success for %s", collectionName);
  return formatMessage({ ...document, _id: result.insertedId });
};

const findMessageById = async (id, type = "") => {
  const db = await getDb();
  const _id = new ObjectId(id);

  if (type && type !== "all") {
    const collectionNames = getCollectionNames(type);
    for (const collectionName of collectionNames) {
      const document = await db.collection(collectionName).findOne({ _id }).catch(() => null);
      if (document) {
        return { collectionName, document };
      }
    }
    return null;
  }

  for (const currentType of Object.keys(collectionMap)) {
    const collectionNames = getCollectionNames(currentType);
    for (const collectionName of collectionNames) {
      const document = await db.collection(collectionName).findOne({ _id }).catch(() => null);
      if (document) {
        return { collectionName, document };
      }
    }
  }

  return null;
};

const updateMessage = async ({ id, type = "", status }) => {
  const normalizedStatus = normalizeStatus(status);
  const db = await getDb();
  const found = await findMessageById(id, type);

  if (!found) {
    const error = new Error("Message not found.");
    error.statusCode = 404;
    throw error;
  }

  const _id = new ObjectId(id);
  await db.collection(found.collectionName).updateOne(
    { _id },
    {
      $set: {
        status: normalizedStatus,
        updatedAt: new Date(),
      },
    }
  );

  const updatedDocument = await db.collection(found.collectionName).findOne({ _id });
  return formatMessage(updatedDocument);
};

const deleteMessage = async ({ id, type = "" }) => {
  const db = await getDb();
  const found = await findMessageById(id, type);

  if (!found) {
    const error = new Error("Message not found.");
    error.statusCode = 404;
    throw error;
  }

  const result = await db.collection(found.collectionName).deleteOne({ _id: new ObjectId(id) });

  if (!result.deletedCount) {
    const error = new Error("Message not found.");
    error.statusCode = 404;
    throw error;
  }
};

const getOverviewStats = async () => {
  const db = await getDb();
  const [contactDocs, hireDocs] = await Promise.all([
    fetchFromCollections(db, "contact", {}, -1),
    fetchFromCollections(db, "hire", {}, -1),
  ]);

  const allDocs = [...contactDocs, ...hireDocs];
  const latestDate = allDocs
    .map((item) => item.createdAt)
    .filter(Boolean)
    .sort((left, right) => new Date(right).getTime() - new Date(left).getTime())[0];

  const statusCounts = allDocs.reduce(
    (accumulator, item) => {
      const status = item.status || "new";
      accumulator[status] = (accumulator[status] || 0) + 1;
      return accumulator;
    },
    { new: 0, read: 0, replied: 0, archived: 0 }
  );

  return {
    totalContactMessages: contactDocs.length,
    totalHireRequests: hireDocs.length,
    totalMessages: allDocs.length,
    newMessages: statusCounts.new,
    readMessages: statusCounts.read,
    repliedMessages: statusCounts.replied,
    archivedMessages: statusCounts.archived,
    latestMessageDate: latestDate || "",
    sourceBreakdown: {
      contact: contactDocs.length,
      "hire-me": hireDocs.length,
    },
    statusBreakdown: statusCounts,
    allMessages: allDocs,
  };
};

const exportMessages = async (params) => {
  const result = await listMessages({ ...params, page: 1, limit: MAX_LIMIT * 1000 });
  return result.entries;
};

module.exports = {
  createMessage,
  deleteMessage,
  exportMessages,
  getOverviewStats,
  listMessages,
  updateMessage,
};
