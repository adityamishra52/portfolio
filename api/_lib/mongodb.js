const { MongoClient, ObjectId } = require("mongodb");

const uri = process.env.MONGODB_URI;
const dbName = "portfolio";

if (!uri) {
  throw new Error("Missing MONGODB_URI environment variable.");
}

const options = {
  serverSelectionTimeoutMS: 10000,
};

console.info("[mongodb] MONGODB_URI %s", uri ? "exists" : "missing");

if (!global._portfolioMongoClient) {
  global._portfolioMongoClient = new MongoClient(uri, options);
}

if (!global._portfolioMongoClientPromise) {
  global._portfolioMongoClientPromise = global._portfolioMongoClient
    .connect()
    .then((client) => {
      console.info("[mongodb] Database connection success");
      return client;
    })
    .catch((error) => {
      console.error("[mongodb] Database connection failed:", error.message);
      global._portfolioMongoClientPromise = null;
      throw error;
    });
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
