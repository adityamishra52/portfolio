const { getMediaDoc, resolveSlot } = require("./_lib/settings");
const { enforceRateLimit } = require("./_lib/rateLimit");
const { sendJson } = require("./_lib/response");

// Served when nothing has been uploaded for a slot.
const DEFAULT_MEDIA = {
  profile: "/Aditaya.png",
  anime: "/hero-desk-anime.webp",
};

const redirectToDefault = (res, slot) => {
  res.status(302).setHeader("Location", DEFAULT_MEDIA[slot]);
  res.setHeader("Cache-Control", "no-store");
  res.end();
};

// Videos need byte-range support: Safari/iOS won't play a <video> without it.
const sendMedia = (req, res, buffer, contentType, etag) => {
  res.setHeader("Content-Type", contentType);
  res.setHeader("Accept-Ranges", "bytes");
  res.setHeader("Cache-Control", "no-cache");
  if (etag) res.setHeader("ETag", etag);

  if (etag && req.headers["if-none-match"] === etag) {
    res.status(304);
    return res.end();
  }

  const range = /^bytes=(\d*)-(\d*)$/.exec(req.headers.range || "");
  if (range && (range[1] || range[2])) {
    const size = buffer.length;
    let start = range[1] ? Number(range[1]) : size - Number(range[2]);
    let end = range[1] && range[2] ? Number(range[2]) : size - 1;
    start = Math.max(0, start);
    end = Math.min(end, size - 1);

    if (start > end || start >= size) {
      res.status(416).setHeader("Content-Range", `bytes */${size}`);
      return res.end();
    }

    res.status(206);
    res.setHeader("Content-Range", `bytes ${start}-${end}/${size}`);
    res.setHeader("Content-Length", end - start + 1);
    return res.end(buffer.subarray(start, end + 1));
  }

  res.status(200);
  res.setHeader("Content-Length", buffer.length);
  return res.end(buffer);
};

module.exports = async (req, res) => {
  const slot = resolveSlot(req.query?.slot);

  if (enforceRateLimit(req, res, { keyPrefix: `media-${slot}`, max: 300, windowMs: 60 * 1000 })) {
    return;
  }

  if (req.method !== "GET" && req.method !== "HEAD") {
    return sendJson(res, 405, { success: false, message: "Method not allowed." });
  }

  // ?meta=1 lets the hero know whether to render <video> or <img>.
  if (req.query?.meta) {
    try {
      const doc = await getMediaDoc(slot, { withData: false });
      res.setHeader("Cache-Control", "no-store");
      return sendJson(res, 200, {
        success: true,
        hasCustomMedia: Boolean(doc),
        contentType: doc?.contentType || null,
        updatedAt: doc?.updatedAt || null,
      });
    } catch (error) {
      return sendJson(res, 200, { success: true, hasCustomMedia: false, contentType: null, updatedAt: null });
    }
  }

  try {
    const doc = await getMediaDoc(slot);

    if (!doc?.data) {
      return redirectToDefault(res, slot);
    }

    const buffer = Buffer.from(doc.data, "base64");
    const contentType = doc.contentType || "image/jpeg";

    if (slot === "profile") {
      res.status(200);
      res.setHeader("Content-Type", contentType);
      res.setHeader("Cache-Control", "no-store");
      return res.end(buffer);
    }

    const etag = doc.updatedAt ? `"${new Date(doc.updatedAt).getTime().toString(36)}"` : null;
    return sendMedia(req, res, buffer, contentType, etag);
  } catch (error) {
    return redirectToDefault(res, slot);
  }
};
