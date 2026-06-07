const { assertAdminAccess } = require("../_lib/auth");
const { getAdminOverviewPayload } = require("../_lib/dashboard");
const { sanitizeErrorMessage, sendJson } = require("../_lib/response");
const { enforceRateLimit } = require("../_lib/rateLimit");

module.exports = async (req, res) => {
  try {
    if (enforceRateLimit(req, res, { keyPrefix: "admin-overview", max: 120, windowMs: 60 * 1000 })) {
      return;
    }

    assertAdminAccess(req);

    if (req.method !== "GET") {
      return sendJson(res, 405, { success: false, message: "Method not allowed." });
    }

    const overview = await getAdminOverviewPayload();
    return sendJson(res, 200, { success: true, message: "Overview loaded", overview });
  } catch (error) {
    return sendJson(res, error.statusCode || 500, {
      success: false,
      message: sanitizeErrorMessage(error, "Could not load overview."),
    });
  }
};
