const { getDb, ObjectId } = require("./mongodb");

const collectionMap = {
  contact: "contactMessages",
  hire: "hireRequests",
};

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 50;
const SEARCH_FIELDS = ["name", "email", "phone", "subject", "message", "projectType", "budget", "timeline", "company"];
const VALID_STATUSES = new Set(["new", "read", "replied", "archived"]);

const getCollectionName = (type) => {
  const collectionName = collectionMap[type];
  if (!collectionName) {
    const error = new Error("Invalid message type.");
    error.statusCode = 400;
    throw error;
  }
  return collectionName;
};

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

const fetchFromCollection = async (db, type, query, sortDirection) => {
  const collectionName = getCollectionName(type);
  const documents = await db.collection(collectionName).find(query).sort({ createdAt: sortDirection }).toArray();
  return documents.map(formatMessage);
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
      fetchFromCollection(db, "contact", query, sortDirection),
      fetchFromCollection(db, "hire", query, sortDirection),
    ]);

    const combined = [...contactEntries, ...hireEntries].sort((left, right) => {
      const delta = new Date(left.createdAt).getTime() - new Date(right.createdAt).getTime();
      return sortDirection === 1 ? delta : -delta;
    });

    return paginateMessages(combined, normalizedPage, normalizedLimit);
  }

  const collectionName = getCollectionName(type);
  const documents = await db.collection(collectionName).find(query).sort({ createdAt: sortDirection }).toArray();
  const formatted = documents.map(formatMessage);
  return paginateMessages(formatted, normalizedPage, normalizedLimit);
};

const createMessage = async (type, payload) => {
  const db = await getDb();
  const collectionName = getCollectionName(type);
  const now = new Date();
  const document = {
    ...payload,
    source: type === "contact" ? "contact" : "hire-me",
    status: "new",
    createdAt: now,
    updatedAt: now,
  };

  try {
    const result = await db.collection(collectionName).insertOne(document);
    console.info("[mongodb] Insert success for %s", collectionName);
    return formatMessage({ ...document, _id: result.insertedId });
  } catch (error) {
    console.error("[mongodb] Insert failed for %s: %s", collectionName, error.message);
    throw error;
  }
};

const findMessageById = async (id, type = "") => {
  const db = await getDb();
  const _id = new ObjectId(id);

  if (type && type !== "all") {
    const collectionName = getCollectionName(type);
    const document = await db.collection(collectionName).findOne({ _id });
    return document ? { collectionName, document } : null;
  }

  for (const currentType of Object.keys(collectionMap)) {
    const collectionName = getCollectionName(currentType);
    const document = await db.collection(collectionName).findOne({ _id });
    if (document) {
      return { collectionName, document };
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
  if (!updatedDocument) {
    const error = new Error("Message not found.");
    error.statusCode = 404;
    throw error;
  }

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
  const [contactCount, hireCount, contactDocs, hireDocs] = await Promise.all([
    db.collection(collectionMap.contact).countDocuments({}),
    db.collection(collectionMap.hire).countDocuments({}),
    db.collection(collectionMap.contact).find({}, { projection: { createdAt: 1, status: 1 } }).toArray(),
    db.collection(collectionMap.hire).find({}, { projection: { createdAt: 1, status: 1 } }).toArray(),
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
    totalContactMessages: contactCount,
    totalHireRequests: hireCount,
    totalMessages: contactCount + hireCount,
    newMessages: statusCounts.new,
    readMessages: statusCounts.read,
    repliedMessages: statusCounts.replied,
    archivedMessages: statusCounts.archived,
    latestMessageDate: latestDate ? new Date(latestDate).toISOString() : "",
    sourceBreakdown: {
      contact: contactCount,
      "hire-me": hireCount,
    },
    statusBreakdown: statusCounts,
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
  findMessageById,
  getOverviewStats,
  listMessages,
  updateMessage,
};
