const jwt = require("jsonwebtoken");
const { getDb } = require("./mongodb");

const TOKEN_TTL = "7d";

const getAdminSecret = () => process.env.ADMIN_KEY || process.env.JWT_SECRET;

const getJwtSecret = () => {
  const jwtSecret = process.env.JWT_SECRET;

  if (!jwtSecret) {
    const error = new Error("Missing JWT_SECRET on the server.");
    error.statusCode = 500;
    throw error;
  }

  return jwtSecret;
};

const getTokenFromRequest = (req) => {
  const authorization = req.headers.authorization || "";
  if (authorization.startsWith("Bearer ")) {
    return authorization.slice("Bearer ".length).trim();
  }
  return "";
};

const recordAdminLogin = async () => {
  const db = await getDb();
  await db.collection("admin_users").updateOne(
    { email: "admin@portfolio.local" },
    {
      $set: {
        role: "admin",
        lastLoginAt: new Date(),
        updatedAt: new Date(),
      },
      $setOnInsert: {
        email: "admin@portfolio.local",
        createdAt: new Date(),
      },
    },
    { upsert: true }
  );
};

const createAdminToken = async () => {
  const adminSecret = getAdminSecret();

  if (!adminSecret) {
    const error = new Error("Missing admin secret on the server.");
    error.statusCode = 500;
    throw error;
  }

  await recordAdminLogin();

  return jwt.sign({ role: "admin" }, getJwtSecret(), {
    expiresIn: TOKEN_TTL,
  });
};

const verifyAdminToken = (token) => jwt.verify(token, getJwtSecret());

const assertAdminAccess = (req) => {
  const token = getTokenFromRequest(req);

  if (token) {
    try {
      const payload = verifyAdminToken(token);
      if (payload?.role !== "admin") {
        const error = new Error("Invalid admin token.");
        error.statusCode = 401;
        throw error;
      }
      return payload;
    } catch (authError) {
      const error = new Error("Admin session expired. Please sign in again.");
      error.statusCode = 401;
      throw error;
    }
  }

  const adminSecret = getAdminSecret();

  if (!adminSecret) {
    const error = new Error("Missing admin secret on the server.");
    error.statusCode = 500;
    throw error;
  }

  if (req.headers["x-admin-key"] !== adminSecret) {
    const error = new Error("Invalid admin credentials.");
    error.statusCode = 401;
    throw error;
  }

  return { role: "admin" };
};

const validateAdminSecret = (secret) => {
  const adminSecret = getAdminSecret();

  if (!adminSecret) {
    const error = new Error("Missing admin secret on the server.");
    error.statusCode = 500;
    throw error;
  }

  if (!secret || secret !== adminSecret) {
    const error = new Error("Invalid admin key.");
    error.statusCode = 401;
    throw error;
  }
};

module.exports = {
  assertAdminAccess,
  createAdminToken,
  getTokenFromRequest,
  validateAdminSecret,
};
