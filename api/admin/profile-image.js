const { assertAdminAccess } = require("../_lib/auth");
const { getProfileImageDoc, setProfileImageDoc, deleteProfileImageDoc } = require("../_lib/settings");
const { sanitizeErrorMessage, sendJson } = require("../_lib/response");
const { parseBody } = require("../_lib/request");
const { enforceRateLimit } = require("../_lib/rateLimit");

const MAX_IMAGE_BYTES = 2 * 1024 * 1024;

const parseImageDataUrl = (dataUrl) => {
  const match = /^data:(image\/(?:jpeg|png|webp));base64,(.+)$/.exec(dataUrl || "");

  if (!match) {
    const error = new Error("Upload a JPEG, PNG, or WebP image.");
    error.statusCode = 400;
    throw error;
  }

  const [, contentType, data] = match;
  const approxBytes = Math.ceil((data.length * 3) / 4);

  if (approxBytes > MAX_IMAGE_BYTES) {
    const error = new Error("Image is too large. Please use an image under 2MB.");
    error.statusCode = 400;
    throw error;
  }

  return { contentType, data };
};

module.exports = async (req, res) => {
  try {
    if (enforceRateLimit(req, res, { keyPrefix: "admin-profile-image", max: 30, windowMs: 60 * 1000 })) {
      return;
    }

    assertAdminAccess(req);

    if (req.method === "GET") {
      const doc = await getProfileImageDoc();
      return sendJson(res, 200, {
        success: true,
        hasCustomImage: Boolean(doc?.data),
        updatedAt: doc?.updatedAt || null,
      });
    }

    if (req.method === "POST") {
      const body = parseBody(req.body);
      const { contentType, data } = parseImageDataUrl(body.image);
      await setProfileImageDoc({ contentType, data });
      return sendJson(res, 200, { success: true, message: "Profile photo updated." });
    }

    if (req.method === "DELETE") {
      await deleteProfileImageDoc();
      return sendJson(res, 200, { success: true, message: "Profile photo reset to default." });
    }

    return sendJson(res, 405, { success: false, message: "Method not allowed." });
  } catch (error) {
    return sendJson(res, error.statusCode || 500, {
      success: false,
      message: sanitizeErrorMessage(error, "Could not update profile photo."),
    });
  }
};
