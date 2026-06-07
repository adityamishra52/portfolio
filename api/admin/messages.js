const { deleteMessage, getOverviewStats, listMessages, updateMessage } = require("../_lib/messages");
const { enforceRateLimit } = require("../_lib/rateLimit");
const { sanitizeErrorMessage, sendJson } = require("../_lib/response");
const { assertAdminAccess } = require("../_lib/auth");
const { parseBody } = require("../_lib/request");

module.exports = async (req, res) => {
  try {
    if (enforceRateLimit(req, res, { keyPrefix: "admin-messages", max: 120, windowMs: 60 * 1000 })) {
      return;
    }

    assertAdminAccess(req);

    if (req.method === "GET") {
      if (req.query.view === "overview") {
        const overview = await getOverviewStats();
        return sendJson(res, 200, { success: true, message: "Overview loaded", overview });
      }

      const result = await listMessages(req.query);
      return sendJson(res, 200, { success: true, message: "Messages loaded", ...result });
    }

    if (req.method === "PATCH") {
      const body = parseBody(req.body);
      const entry = await updateMessage({
        id: body.id,
        type: body.type,
        status: body.status,
      });
      return sendJson(res, 200, { success: true, message: "Message updated", entry });
    }

    if (req.method === "DELETE" && req.query.id) {
      await deleteMessage({ type: req.query.type, id: req.query.id });
      return sendJson(res, 200, { success: true, message: "Message deleted" });
    }

    return sendJson(res, 405, { success: false, message: "Method not allowed." });
  } catch (error) {
    console.error("[api/admin/messages] Request failed:", error.message);
    return sendJson(res, error.statusCode || 500, {
      success: false,
      message: sanitizeErrorMessage(error, "Could not complete admin action."),
    });
  }
};
