const { getProfileImageDoc } = require("./_lib/settings");
const { enforceRateLimit } = require("./_lib/rateLimit");

const redirectToDefault = (res) => {
  res.status(302).setHeader("Location", "/Aditaya.png");
  res.setHeader("Cache-Control", "public, max-age=300");
  res.end();
};

module.exports = async (req, res) => {
  if (enforceRateLimit(req, res, { keyPrefix: "profile-image", max: 300, windowMs: 60 * 1000 })) {
    return;
  }

  if (req.method !== "GET") {
    res.status(405).setHeader("Content-Type", "application/json");
    return res.end(JSON.stringify({ success: false, message: "Method not allowed." }));
  }

  try {
    const doc = await getProfileImageDoc();

    if (!doc?.data) {
      return redirectToDefault(res);
    }

    const buffer = Buffer.from(doc.data, "base64");
    res.status(200);
    res.setHeader("Content-Type", doc.contentType || "image/jpeg");
    res.setHeader("Cache-Control", "public, max-age=300, must-revalidate");
    return res.end(buffer);
  } catch (error) {
    return redirectToDefault(res);
  }
};
