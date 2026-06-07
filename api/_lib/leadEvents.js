const { getDb } = require("./mongodb");

const collectionMap = {
  resume: "resume_events",
  project: "project_events",
  social: "social_events",
};

const formatLeadEvent = (document) => ({
  id: document._id.toString(),
  kind: document.kind,
  action: document.action,
  label: document.label || "",
  source: document.source || "",
  metadata: document.metadata || {},
  path: document.path || "",
  createdAt: document.createdAt instanceof Date ? document.createdAt.toISOString() : new Date(document.createdAt).toISOString(),
});

const createLeadEvent = async ({ category, action, label = "", metadata = {}, path = "", userAgent = "", ipAddress = "" }) => {
  const kind = category.toLowerCase();
  const collectionName = collectionMap[kind];

  if (!collectionName) {
    const error = new Error("Unsupported lead event category.");
    error.statusCode = 400;
    throw error;
  }

  const db = await getDb();
  const document = {
    kind,
    action,
    label,
    source: kind,
    metadata,
    path,
    userAgent,
    ipAddress,
    createdAt: new Date(),
  };

  const result = await db.collection(collectionName).insertOne(document);
  return formatLeadEvent({ ...document, _id: result.insertedId });
};

const countEventCollection = async (db, collectionName, filter = {}) => {
  return db.collection(collectionName).countDocuments(filter);
};

const getEventOverview = async () => {
  const db = await getDb();
  const [resumeDownloads, projectClicks, socialClicks, githubClicks, linkedinClicks, whatsappClicks] = await Promise.all([
    countEventCollection(db, "resume_events", { action: { $regex: "Download", $options: "i" } }),
    countEventCollection(db, "project_events"),
    countEventCollection(db, "social_events"),
    countEventCollection(db, "social_events", { action: { $regex: "GitHub", $options: "i" } }),
    countEventCollection(db, "social_events", { action: { $regex: "LinkedIn", $options: "i" } }),
    countEventCollection(db, "social_events", { action: { $regex: "WhatsApp", $options: "i" } }),
  ]);

  return {
    resumeDownloads,
    projectClicks,
    socialClicks,
    githubClicks,
    linkedinClicks,
    whatsappClicks,
  };
};

module.exports = {
  createLeadEvent,
  getEventOverview,
};
