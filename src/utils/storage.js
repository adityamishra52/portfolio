const CONTACT_MESSAGE_KEY = "aditaya_portfolio_contact_messages";
const HIRE_REQUEST_KEY = "aditaya_portfolio_hire_requests";

const safeParse = (value) => {
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const createId = () =>
  typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2)}`;

const getEntries = (storageKey) => {
  if (typeof window === "undefined") return [];
  return safeParse(window.localStorage.getItem(storageKey));
};

const saveEntries = (storageKey, entries) => {
  if (typeof window === "undefined") return entries;
  window.localStorage.setItem(storageKey, JSON.stringify(entries));
  return entries;
};

const upsertLocalEntry = (storageKey, entry) => {
  const nextEntries = [entry, ...getEntries(storageKey).filter((current) => current.id !== entry.id)];
  nextEntries.sort((left, right) => new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime());
  return saveEntries(storageKey, nextEntries);
};

const removeLocalEntry = (storageKey, id) => saveEntries(storageKey, getEntries(storageKey).filter((entry) => entry.id !== id));

const saveFallbackRecord = (storageKey, payload) => {
  const nextEntry = {
    id: createId(),
    read: false,
    createdAt: new Date().toISOString(),
    ...payload,
  };

  upsertLocalEntry(storageKey, nextEntry);
  return nextEntry;
};

const sanitizeContactMessage = (message) => ({
  name: message.name.trim(),
  email: message.email.trim(),
  subject: message.subject.trim(),
  message: message.message.trim(),
});

const sanitizeHireRequest = (request) => ({
  name: request.name.trim(),
  email: request.email.trim(),
  company: request.company.trim(),
  projectType: request.projectType.trim(),
  budget: request.budget.trim(),
  timeline: request.timeline.trim(),
  message: request.message.trim(),
});

const parseResponse = async (response) => {
  const contentType = response.headers.get("content-type") || "";
  let data = {};
  let text = "";

  if (contentType.includes("application/json")) {
    try {
      data = await response.json();
    } catch {
      data = {};
    }
  } else {
    text = await response.text();
  }

  if (!response.ok) {
    const errorMessage =
      data.message ||
      data.error ||
      text ||
      "A server error occurred. Please try again.";
    const error = new Error(errorMessage);
    error.status = response.status;
    throw error;
  }

  if (contentType.includes("application/json")) {
    return data;
  }

  return { success: true, message: text || "Request completed." };
};

const requestJson = async (url, options = {}) => {
  const response = await fetch(url, options);
  return parseResponse(response);
};

const adminHeaders = (adminKey) => ({
  "Content-Type": "application/json",
  "x-admin-key": adminKey,
});

const shouldFallbackToLocal = (error) => !error.status || error.status >= 500;

export const saveContactMessage = async (message) => {
  const payload = sanitizeContactMessage(message);

  try {
    const data = await requestJson("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    upsertLocalEntry(CONTACT_MESSAGE_KEY, data.entry);
    return { entry: data.entry, source: "database" };
  } catch (error) {
    if (!shouldFallbackToLocal(error)) {
      throw error;
    }

    const entry = saveFallbackRecord(CONTACT_MESSAGE_KEY, payload);
    return {
      entry,
      source: "fallback",
      errorMessage: error.message || "Could not save to the database.",
    };
  }
};

export const saveHireRequest = async (request) => {
  const payload = sanitizeHireRequest(request);

  try {
    const data = await requestJson("/api/hire", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    upsertLocalEntry(HIRE_REQUEST_KEY, data.entry);
    return { entry: data.entry, source: "database" };
  } catch (error) {
    if (!shouldFallbackToLocal(error)) {
      throw error;
    }

    const entry = saveFallbackRecord(HIRE_REQUEST_KEY, payload);
    return {
      entry,
      source: "fallback",
      errorMessage: error.message || "Could not save to the database.",
    };
  }
};

export const getContactMessages = async (adminKey) => {
  try {
    const data = await requestJson("/api/admin/messages?type=contact", {
      headers: adminHeaders(adminKey),
    });

    saveEntries(CONTACT_MESSAGE_KEY, data.entries);
    return { entries: data.entries, source: "database" };
  } catch (error) {
    if (!shouldFallbackToLocal(error)) throw error;
    return {
      entries: getEntries(CONTACT_MESSAGE_KEY),
      source: "fallback",
      errorMessage: error.message || "Could not load contact messages from the database.",
    };
  }
};

export const getHireRequests = async (adminKey) => {
  try {
    const data = await requestJson("/api/admin/messages?type=hire", {
      headers: adminHeaders(adminKey),
    });

    saveEntries(HIRE_REQUEST_KEY, data.entries);
    return { entries: data.entries, source: "database" };
  } catch (error) {
    if (!shouldFallbackToLocal(error)) throw error;
    return {
      entries: getEntries(HIRE_REQUEST_KEY),
      source: "fallback",
      errorMessage: error.message || "Could not load hire requests from the database.",
    };
  }
};

export const setContactMessageRead = async (id, read, adminKey) => {
  const data = await requestJson("/api/admin/messages", {
    method: "PATCH",
    headers: adminHeaders(adminKey),
    body: JSON.stringify({ type: "contact", id, read }),
  });

  upsertLocalEntry(CONTACT_MESSAGE_KEY, data.entry);
  return data.entry;
};

export const setHireRequestRead = async (id, read, adminKey) => {
  const data = await requestJson("/api/admin/messages", {
    method: "PATCH",
    headers: adminHeaders(adminKey),
    body: JSON.stringify({ type: "hire", id, read }),
  });

  upsertLocalEntry(HIRE_REQUEST_KEY, data.entry);
  return data.entry;
};

export const deleteContactMessage = async (id, adminKey) => {
  await requestJson(`/api/admin/messages?type=contact&id=${encodeURIComponent(id)}`, {
    method: "DELETE",
    headers: { "x-admin-key": adminKey },
  });

  return removeLocalEntry(CONTACT_MESSAGE_KEY, id);
};

export const deleteHireRequest = async (id, adminKey) => {
  await requestJson(`/api/admin/messages?type=hire&id=${encodeURIComponent(id)}`, {
    method: "DELETE",
    headers: { "x-admin-key": adminKey },
  });

  return removeLocalEntry(HIRE_REQUEST_KEY, id);
};

export const getSubmissionStats = (entries) => ({
  total: entries.length,
  unread: entries.filter((entry) => !entry.read).length,
  recent: entries.slice(0, 5),
});
