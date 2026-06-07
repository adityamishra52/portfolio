const { createMessage } = require("./_lib/messages");
const { sanitizeErrorMessage, sendJson } = require("./_lib/response");
const { getIpAddress, parseBody } = require("./_lib/request");

const validateContactPayload = (payload) => {
  if (!payload.name?.trim()) return "Name is required.";
  if (!payload.email?.trim()) return "Email is required.";
  if (!payload.subject?.trim()) return "Subject is required.";
  if (!payload.message?.trim()) return "Message is required.";
  return "";
};

module.exports = async (req, res) => {
  try {
    if (req.method !== "POST") {
      return sendJson(res, 405, { success: false, message: "Method not allowed." });
    }

    const body = parseBody(req.body);
    const errorMessage = validateContactPayload(body);

    if (errorMessage) {
      return sendJson(res, 400, { success: false, message: errorMessage });
    }

    const entry = await createMessage("contact", {
      name: body.name.trim(),
      email: body.email.trim(),
      phone: body.phone?.trim() || "",
      subject: body.subject.trim(),
      message: body.message.trim(),
      userAgent: req.headers["user-agent"] || "",
      ipAddress: getIpAddress(req),
    });

    return sendJson(res, 200, { success: true, message: "Message saved", entry });
  } catch (error) {
    console.error("[api/contact] Request failed:", error.message);
    return sendJson(res, error.statusCode || 500, {
      success: false,
      message: sanitizeErrorMessage(error, "Could not save contact message."),
    });
  }
};
