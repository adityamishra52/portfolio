const { createAdminToken, validateAdminSecret } = require("../_lib/auth");
const { sanitizeErrorMessage, sendJson } = require("../_lib/response");
const { parseBody } = require("../_lib/request");
const { enforceRateLimit } = require("../_lib/rateLimit");

module.exports = async (req, res) => {
  try {
    if (enforceRateLimit(req, res, { keyPrefix: "admin-login", max: 10, windowMs: 60 * 1000 })) {
      return;
    }

    if (req.method !== "POST") {
      return sendJson(res, 405, { success: false, message: "Method not allowed." });
    }

    const body = parseBody(req.body);
    validateAdminSecret(body.secret?.trim());
    const token = await createAdminToken();

    return sendJson(res, 200, {
      success: true,
      message: "Admin session created.",
      token,
      expiresIn: "7d",
    });
  } catch (error) {
    return sendJson(res, error.statusCode || 500, {
      success: false,
      message: sanitizeErrorMessage(error, "Could not sign in."),
    });
  }
};
