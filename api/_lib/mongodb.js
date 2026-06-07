const { MongoClient, ObjectId } = require("mongodb");

const uri = process.env.MONGODB_URI;
const dbName = "portfolio";

if (!uri) {
  throw new Error("Missing MONGODB_URI environment variable.");
}

const options = {
  serverSelectionTimeoutMS: 10000,
};

if (!global._portfolioMongoClient) {
  global._portfolioMongoClient = new MongoClient(uri, options);
}

if (!global._portfolioMongoClientPromise) {
  global._portfolioMongoClientPromise = global._portfolioMongoClient.connect();
}

const clientPromise = global._portfolioMongoClientPromise;

const getDb = async () => {
  const connectedClient = await clientPromise;
  return connectedClient.db(dbName);
};

module.exports = {
  getDb,
  ObjectId,
};
