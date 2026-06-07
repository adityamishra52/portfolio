const assertAdminAccess = (req) => {
  const adminKey = process.env.ADMIN_KEY;

  if (!adminKey) {
    const error = new Error("Missing ADMIN_KEY on the server.");
    error.statusCode = 500;
    throw error;
  }

  if (req.headers["x-admin-key"] !== adminKey) {
    const error = new Error("Invalid admin key.");
    error.statusCode = 401;
    throw error;
  }
};

module.exports = {
  assertAdminAccess,
};
