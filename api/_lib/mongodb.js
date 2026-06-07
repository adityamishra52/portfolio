const { MongoClient, ObjectId } = require("mongodb");

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB_NAME || "portfolio";

if (!uri) {
  throw new Error("Missing MONGODB_URI environment variable.");
}

let client;
let clientPromise;

if (process.env.NODE_ENV === "development") {
  if (!global._portfolioMongoClientPromise) {
    client = new MongoClient(uri);
    global._portfolioMongoClientPromise = client.connect();
  }
  clientPromise = global._portfolioMongoClientPromise;
} else {
  client = new MongoClient(uri);
  clientPromise = client.connect();
}

const getDb = async () => {
  const connectedClient = await clientPromise;
  return connectedClient.db(dbName);
};

module.exports = {
  getDb,
  ObjectId,
};
