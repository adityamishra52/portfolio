const sanitizeErrorMessage = (error, fallbackMessage) => {
  const rawMessage = error?.message || fallbackMessage;

  if (!rawMessage) {
    return "A server error occurred.";
  }

  return rawMessage
    .replace(/mongodb(\+srv)?:\/\/[^@\s]+@/gi, "mongodb://<redacted>@")
    .replace(/(password|passwd|pwd)=([^&\s]+)/gi, "$1=<redacted>");
};

const sendJson = (res, statusCode, payload) => {
  res.status(statusCode).setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(payload));
};

module.exports = {
  sanitizeErrorMessage,
  sendJson,
};
