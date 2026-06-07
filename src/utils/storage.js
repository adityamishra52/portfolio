const ADMIN_SESSION_KEY = "aditaya_portfolio_admin_session";

const sanitizeContactMessage = (message) => ({
  name: message.name.trim(),
  email: message.email.trim(),
  phone: message.phone?.trim() || "",
  subject: message.subject.trim(),
  message: message.message.trim(),
});

const sanitizeHireRequest = (request) => ({
  name: request.name.trim(),
  email: request.email.trim(),
  phone: request.phone?.trim() || "",
  company: request.company.trim(),
  subject: request.subject?.trim() || request.projectType.trim(),
  projectType: request.projectType.trim(),
  budget: request.budget.trim(),
  timeline: request.timeline.trim(),
  message: request.message.trim(),
});

const parseResponse = async (response) => {
  const contentType = response.headers.get("content-type") || "";

  if (contentType.includes("application/json")) {
    const data = await response.json().catch(() => ({}));

    if (!response.ok || data.success === false) {
      const error = new Error(data.message || "A server error occurred. Please try again.");
      error.status = response.status;
      throw error;
    }

    return data;
  }

  const text = await response.text();

  if (!response.ok) {
    const error = new Error(text || "A server error occurred. Please try again.");
    error.status = response.status;
    throw error;
  }

  return { success: true, message: text || "Request completed." };
};

const requestJson = async (url, options = {}) => {
  const response = await fetch(url, options);
  return parseResponse(response);
};

const buildAdminHeaders = (token, includeJson = true) => {
  const headers = {};

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  if (includeJson) {
    headers["Content-Type"] = "application/json";
  }

  return headers;
};

export const saveContactMessage = async (message) => {
  const payload = sanitizeContactMessage(message);

  return requestJson("/api/contact", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
};

export const saveHireRequest = async (request) => {
  const payload = sanitizeHireRequest(request);

  return requestJson("/api/hire", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
};

export const loginAdmin = async (secret) =>
  requestJson("/api/admin/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ secret }),
  });

export const getAdminOverview = async (token) =>
  requestJson("/api/admin/overview", {
    headers: buildAdminHeaders(token, false),
  });

export const getAdminMessages = async (token, params) => {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      searchParams.set(key, value);
    }
  });

  return requestJson(`/api/admin/messages?${searchParams.toString()}`, {
    headers: buildAdminHeaders(token, false),
  });
};

export const updateAdminMessage = async (token, id, payload) =>
  requestJson(`/api/admin/messages/${encodeURIComponent(id)}${payload.type ? `?type=${encodeURIComponent(payload.type)}` : ""}`, {
    method: "PATCH",
    headers: buildAdminHeaders(token),
    body: JSON.stringify(payload),
  });

export const deleteAdminMessage = async (token, id, type) =>
  requestJson(`/api/admin/messages/${encodeURIComponent(id)}?type=${encodeURIComponent(type)}`, {
    method: "DELETE",
    headers: buildAdminHeaders(token, false),
  });

export const exportAdminMessages = async (token, params, format = "csv") => {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      searchParams.set(key, value);
    }
  });

  searchParams.set("format", format);

  const response = await fetch(`/api/admin/export?${searchParams.toString()}`, {
    headers: buildAdminHeaders(token, false),
  });

  const contentType = response.headers.get("content-type") || "";
  if (!response.ok || contentType.includes("application/json")) {
    await parseResponse(response);
  }

  return response.blob();
};

export const saveAdminSession = (session) => {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(session));
};

export const getAdminSession = () => {
  if (typeof window === "undefined") return null;

  try {
    const raw = window.localStorage.getItem(ADMIN_SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const clearAdminSession = () => {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(ADMIN_SESSION_KEY);
};
