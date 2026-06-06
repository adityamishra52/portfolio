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
  window.localStorage.setItem(storageKey, JSON.stringify(entries));
  return entries;
};

const saveRecord = (storageKey, payload) => {
  const currentEntries = getEntries(storageKey);
  const nextEntry = {
    id: createId(),
    read: false,
    createdAt: new Date().toISOString(),
    ...payload,
  };

  saveEntries(storageKey, [nextEntry, ...currentEntries]);
  return nextEntry;
};

const deleteRecord = (storageKey, id) => {
  const nextEntries = getEntries(storageKey).filter((entry) => entry.id !== id);
  return saveEntries(storageKey, nextEntries);
};

const toggleRecordRead = (storageKey, id) => {
  const nextEntries = getEntries(storageKey).map((entry) =>
    entry.id === id ? { ...entry, read: !entry.read } : entry
  );
  return saveEntries(storageKey, nextEntries);
};

export const getContactMessages = () => getEntries(CONTACT_MESSAGE_KEY);

export const saveContactMessage = (message) =>
  saveRecord(CONTACT_MESSAGE_KEY, {
    type: "contact",
    name: message.name.trim(),
    email: message.email.trim(),
    subject: message.subject.trim(),
    message: message.message.trim(),
  });

export const deleteContactMessage = (id) => deleteRecord(CONTACT_MESSAGE_KEY, id);

export const toggleContactMessageRead = (id) => toggleRecordRead(CONTACT_MESSAGE_KEY, id);

export const getHireRequests = () => getEntries(HIRE_REQUEST_KEY);

export const saveHireRequest = (request) =>
  saveRecord(HIRE_REQUEST_KEY, {
    type: "hire",
    name: request.name.trim(),
    email: request.email.trim(),
    company: request.company.trim(),
    projectType: request.projectType.trim(),
    budget: request.budget.trim(),
    timeline: request.timeline.trim(),
    message: request.message.trim(),
  });

export const deleteHireRequest = (id) => deleteRecord(HIRE_REQUEST_KEY, id);

export const toggleHireRequestRead = (id) => toggleRecordRead(HIRE_REQUEST_KEY, id);

export const getSubmissionStats = (entries) => ({
  total: entries.length,
  unread: entries.filter((entry) => !entry.read).length,
  recent: entries.slice(0, 5),
});
