const DEFAULT_WINDOW_MS = 60 * 1000;
const DEFAULT_MAX = 30;

if (!global._portfolioRateLimitStore) {
  global._portfolioRateLimitStore = new Map();
}

const store = global._portfolioRateLimitStore;

const getClientIp = (req) => {
  const forwarded = req.headers["x-forwarded-for"];
  if (typeof forwarded === "string" && forwarded.trim()) {
    return forwarded.split(",")[0].trim();
  }

  return req.headers["x-real-ip"] || req.socket?.remoteAddress || "unknown";
};

const buildKey = (req, keyPrefix) => `${keyPrefix}:${getClientIp(req)}`;

const enforceRateLimit = (req, res, { keyPrefix, windowMs = DEFAULT_WINDOW_MS, max = DEFAULT_MAX }) => {
  const key = buildKey(req, keyPrefix);
  const now = Date.now();
  const current = store.get(key);

  if (!current || current.resetAt <= now) {
    store.set(key, { count: 1, resetAt: now + windowMs });
    return false;
  }

  if (current.count >= max) {
    const retryAfterSeconds = Math.max(Math.ceil((current.resetAt - now) / 1000), 1);
    res.status(429).setHeader("Content-Type", "application/json");
    res.setHeader("Retry-After", String(retryAfterSeconds));
    res.end(JSON.stringify({ success: false, message: "Too many requests. Please try again shortly." }));
    return true;
  }

  current.count += 1;
  store.set(key, current);
  return false;
};

module.exports = {
  enforceRateLimit,
};
