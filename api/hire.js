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

const validateHirePayload = (payload) => {
  if (!payload.name?.trim()) return "Name is required.";
  if (!payload.email?.trim()) return "Email is required.";
  if (!payload.company?.trim()) return "Company is required.";
  if (!payload.projectType?.trim()) return "Project type is required.";
  if (!payload.budget?.trim()) return "Budget is required.";
  if (!payload.timeline?.trim()) return "Timeline is required.";
  if (!payload.message?.trim()) return "Message is required.";
  return "";
};

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    return sendJson(res, 405, { error: "Method not allowed." });
  }

  try {
    const body = parseBody(req.body);
    const errorMessage = validateHirePayload(body);

    if (errorMessage) {
      return sendJson(res, 400, { error: errorMessage });
    }

    const entry = await createMessage("hire", {
      name: body.name.trim(),
      email: body.email.trim(),
      company: body.company.trim(),
      projectType: body.projectType.trim(),
      budget: body.budget.trim(),
      timeline: body.timeline.trim(),
      message: body.message.trim(),
    });

    return sendJson(res, 201, { entry });
  } catch (error) {
    return sendJson(res, error.statusCode || 500, {
      error: error.message || "Could not save hire request.",
    });
  }
};
