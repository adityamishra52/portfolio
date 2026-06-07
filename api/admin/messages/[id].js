const { deleteMessage, updateMessage } = require("../../_lib/messages");
const { enforceRateLimit } = require("../../_lib/rateLimit");
const { sanitizeErrorMessage, sendJson } = require("../../_lib/response");
const { assertAdminAccess } = require("../../_lib/auth");
const { parseBody } = require("../../_lib/request");

module.exports = async (req, res) => {
  try {
    if (enforceRateLimit(req, res, { keyPrefix: "admin-message-detail", max: 120, windowMs: 60 * 1000 })) {
      return;
    }

    assertAdminAccess(req);
    const id = req.query.id;

    if (req.method === "PATCH") {
      const body = parseBody(req.body);
      const entry = await updateMessage({
        id,
        type: body.type || req.query.type,
        status: body.status,
      });

      return sendJson(res, 200, { success: true, message: "Message updated", entry });
    }

    if (req.method === "DELETE") {
      await deleteMessage({ id, type: req.query.type });
      return sendJson(res, 200, { success: true, message: "Message deleted" });
    }

    return sendJson(res, 405, { success: false, message: "Method not allowed." });
  } catch (error) {
    console.error("[api/admin/messages/:id] Request failed:", error.message);
    return sendJson(res, error.statusCode || 500, {
      success: false,
      message: sanitizeErrorMessage(error, "Could not complete admin action."),
    });
  }
};
