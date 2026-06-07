const { getDb, ObjectId } = require("./mongodb");

const collectionMap = {
  contact: "contactMessages",
  hire: "hireRequests",
};

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
  name: document.name,
  email: document.email,
  subject: document.subject || "",
  company: document.company || "",
  projectType: document.projectType || "",
  budget: document.budget || "",
  timeline: document.timeline || "",
  message: document.message,
  read: Boolean(document.read),
  createdAt: document.createdAt instanceof Date ? document.createdAt.toISOString() : new Date(document.createdAt).toISOString(),
});

const listMessages = async (type) => {
  const db = await getDb();
  const collectionName = getCollectionName(type);
  const documents = await db.collection(collectionName).find({}).sort({ createdAt: -1 }).toArray();
  return documents.map(formatMessage);
};

const createMessage = async (type, payload) => {
  const db = await getDb();
  const collectionName = getCollectionName(type);
  const document = {
    ...payload,
    read: false,
    createdAt: new Date(),
  };

  const result = await db.collection(collectionName).insertOne(document);
  return formatMessage({ ...document, _id: result.insertedId });
};

const updateMessageRead = async (type, id, read) => {
  const db = await getDb();
  const collectionName = getCollectionName(type);
  const _id = new ObjectId(id);

  await db.collection(collectionName).updateOne({ _id }, { $set: { read: Boolean(read) } });
  const updatedDocument = await db.collection(collectionName).findOne({ _id });

  if (!updatedDocument) {
    const error = new Error("Message not found.");
    error.statusCode = 404;
    throw error;
  }

  return formatMessage(updatedDocument);
};

const deleteMessage = async (type, id) => {
  const db = await getDb();
  const collectionName = getCollectionName(type);
  const result = await db.collection(collectionName).deleteOne({ _id: new ObjectId(id) });

  if (!result.deletedCount) {
    const error = new Error("Message not found.");
    error.statusCode = 404;
    throw error;
  }
};

module.exports = {
  createMessage,
  deleteMessage,
  listMessages,
  updateMessageRead,
};
