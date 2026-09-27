const { assertAdminAccess } = require("../_lib/auth");
const { getMediaDoc, setMediaDoc, deleteMediaDoc, resolveSlot } = require("../_lib/settings");
const { sanitizeErrorMessage, sendJson } = require("../_lib/response");
const { parseBody } = require("../_lib/request");
const { enforceRateLimit } = require("../_lib/rateLimit");

// The anime slot takes GIFs and short videos, so it allows more types and a
// larger size. 3MB of base64 stays under Vercel's 4.5MB request body limit.
const SLOT_RULES = {
  profile: {
    pattern: /^data:(image\/(?:jpeg|png|webp));base64,(.+)$/,
    maxBytes: 2 * 1024 * 1024,
    typeError: "Upload a JPEG, PNG, or WebP image.",
    sizeError: "Image is too large. Please use an image under 2MB.",
    label: "Profile photo",
  },
  anime: {
    pattern: /^data:((?:image\/(?:gif|webp|png|jpeg))|(?:video\/(?:mp4|webm)));base64,(.+)$/,
    maxBytes: 3 * 1024 * 1024,
    typeError: "Upload a GIF, WebP, PNG, JPEG, MP4, or WebM file.",
    sizeError: "File is too large. Please keep the GIF or video under 3MB.",
    label: "Hero animation",
  },
};

const parseMediaDataUrl = (dataUrl, rules) => {
  const match = rules.pattern.exec(dataUrl || "");

  if (!match) {
    const error = new Error(rules.typeError);
    error.statusCode = 400;
    throw error;
  }

  const [, contentType, data] = match;
  const approxBytes = Math.ceil((data.length * 3) / 4);

  if (approxBytes > rules.maxBytes) {
    const error = new Error(rules.sizeError);
    error.statusCode = 400;
    throw error;
  }

  return { contentType, data };
};

module.exports = async (req, res) => {
  const slot = resolveSlot(req.query?.slot);
  const rules = SLOT_RULES[slot];

  try {
    if (enforceRateLimit(req, res, { keyPrefix: "admin-profile-image", max: 30, windowMs: 60 * 1000 })) {
      return;
    }

    assertAdminAccess(req);

    if (req.method === "GET") {
      const doc = await getMediaDoc(slot, { withData: false });
      return sendJson(res, 200, {
        success: true,
        hasCustomImage: Boolean(doc),
        contentType: doc?.contentType || null,
        updatedAt: doc?.updatedAt || null,
      });
    }

    if (req.method === "POST") {
      const body = parseBody(req.body);
      const { contentType, data } = parseMediaDataUrl(body.image, rules);
      await setMediaDoc(slot, { contentType, data });
      return sendJson(res, 200, { success: true, message: `${rules.label} updated.` });
    }

    if (req.method === "DELETE") {
      await deleteMediaDoc(slot);
      return sendJson(res, 200, { success: true, message: `${rules.label} reset to default.` });
    }

    return sendJson(res, 405, { success: false, message: "Method not allowed." });
  } catch (error) {
    return sendJson(res, error.statusCode || 500, {
      success: false,
      message: sanitizeErrorMessage(error, `Could not update ${rules.label.toLowerCase()}.`),
    });
  }
};
