const { getDb } = require("./_lib/mongodb");
const { enforceRateLimit } = require("./_lib/rateLimit");
const { sanitizeErrorMessage, sendJson } = require("./_lib/response");

module.exports = async (req, res) => {
  try {
    if (enforceRateLimit(req, res, { keyPrefix: "health", max: 30, windowMs: 60 * 1000 })) {
      return;
    }

    if (req.method !== "GET") {
      return sendJson(res, 405, { success: false, message: "Method not allowed." });
    }

    await getDb().then((db) => db.command({ ping: 1 }));
    return sendJson(res, 200, { success: true, message: "API healthy" });
  } catch (error) {
    console.error("[api/health] Health check failed:", error.message);
    return sendJson(res, 500, {
      success: false,
      message: sanitizeErrorMessage(error, "Health check failed."),
    });
  }
};
