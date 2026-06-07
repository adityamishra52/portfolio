const { createMessage } = require("./_lib/messages");

const sendJson = (res, statusCode, payload) => {
  res.status(statusCode).setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(payload));
};

const parseBody = (body) => {
  if (!body) return {};
  if (typeof body === "string") return JSON.parse(body);
  return body;
};

const validateContactPayload = (payload) => {
  if (!payload.name?.trim()) return "Name is required.";
  if (!payload.email?.trim()) return "Email is required.";
  if (!payload.subject?.trim()) return "Subject is required.";
  if (!payload.message?.trim()) return "Message is required.";
  return "";
};

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    return sendJson(res, 405, { error: "Method not allowed." });
  }

  try {
    const body = parseBody(req.body);
    const errorMessage = validateContactPayload(body);

    if (errorMessage) {
      return sendJson(res, 400, { error: errorMessage });
    }

    const entry = await createMessage("contact", {
      name: body.name.trim(),
      email: body.email.trim(),
      subject: body.subject.trim(),
      message: body.message.trim(),
    });

    return sendJson(res, 201, { entry });
  } catch (error) {
    return sendJson(res, error.statusCode || 500, {
      error: error.message || "Could not save contact message.",
    });
  }
};
