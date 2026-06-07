const { deleteMessage, listMessages, updateMessageRead } = require("../_lib/messages");

const sendJson = (res, statusCode, payload) => {
  res.status(statusCode).setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(payload));
};

const parseBody = (body) => {
  if (!body) return {};
  if (typeof body === "string") return JSON.parse(body);
  return body;
};

const assertAdminAccess = (req) => {
  const adminKey = process.env.VITE_ADMIN_KEY;

  if (!adminKey) {
    const error = new Error("Missing VITE_ADMIN_KEY on the server.");
    error.statusCode = 500;
    throw error;
  }

  if (req.headers["x-admin-key"] !== adminKey) {
    const error = new Error("Invalid admin key.");
    error.statusCode = 401;
    throw error;
  }
};

module.exports = async (req, res) => {
  try {
    assertAdminAccess(req);

    if (req.method === "GET") {
      const type = req.query.type;
      const entries = await listMessages(type);
      return sendJson(res, 200, { entries });
    }

    if (req.method === "PATCH") {
      const body = parseBody(req.body);
      const entry = await updateMessageRead(body.type, body.id, body.read);
      return sendJson(res, 200, { entry });
    }

    if (req.method === "DELETE") {
      const { type, id } = req.query;
      await deleteMessage(type, id);
      return sendJson(res, 200, { ok: true });
    }

    return sendJson(res, 405, { error: "Method not allowed." });
  } catch (error) {
    return sendJson(res, error.statusCode || 500, {
      error: error.message || "Could not complete admin action.",
    });
  }
};
