const { createLeadEvent } = require("./_lib/leadEvents");
const { sanitizeErrorMessage, sendJson } = require("./_lib/response");
const { getIpAddress, parseBody } = require("./_lib/request");
const { enforceRateLimit } = require("./_lib/rateLimit");

module.exports = async (req, res) => {
  try {
    if (enforceRateLimit(req, res, { keyPrefix: "lead-events", max: 40, windowMs: 60 * 1000 })) {
      return;
    }

    if (req.method !== "POST") {
      return sendJson(res, 405, { success: false, message: "Method not allowed." });
    }

    const body = parseBody(req.body);

    const event = await createLeadEvent({
      category: body.category,
      action: body.action,
      label: body.label || "",
      metadata: body.metadata || {},
      path: body.path || "",
      userAgent: req.headers["user-agent"] || "",
      ipAddress: getIpAddress(req),
    });

    return sendJson(res, 200, { success: true, message: "Lead event stored", event });
  } catch (error) {
    return sendJson(res, error.statusCode || 500, {
      success: false,
      message: sanitizeErrorMessage(error, "Could not store lead event."),
    });
  }
};
