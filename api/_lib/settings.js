const { getDb } = require("./mongodb");

const SETTINGS_COLLECTION = "site_settings";

// Each media slot is one document in site_settings. "profile" is the portrait
// used on About; "anime" is the GIF/video slide in the Home hero carousel.
const MEDIA_SLOTS = {
  profile: "profile-image",
  anime: "hero-animation",
};

const resolveSlot = (slot) => (Object.prototype.hasOwnProperty.call(MEDIA_SLOTS, slot) ? slot : "profile");

const getMediaDoc = async (slot, { withData = true } = {}) => {
  const db = await getDb();
  return db
    .collection(SETTINGS_COLLECTION)
    .findOne({ _id: MEDIA_SLOTS[resolveSlot(slot)] }, withData ? {} : { projection: { data: 0 } });
};

const setMediaDoc = async (slot, { data, contentType }) => {
  const db = await getDb();
  await db.collection(SETTINGS_COLLECTION).updateOne(
    { _id: MEDIA_SLOTS[resolveSlot(slot)] },
    { $set: { data, contentType, updatedAt: new Date() } },
    { upsert: true }
  );
};

const deleteMediaDoc = async (slot) => {
  const db = await getDb();
  await db.collection(SETTINGS_COLLECTION).deleteOne({ _id: MEDIA_SLOTS[resolveSlot(slot)] });
};

const getProfileImageDoc = () => getMediaDoc("profile");
const setProfileImageDoc = (payload) => setMediaDoc("profile", payload);
const deleteProfileImageDoc = () => deleteMediaDoc("profile");

module.exports = {
  resolveSlot,
  getMediaDoc,
  setMediaDoc,
  deleteMediaDoc,
  getProfileImageDoc,
  setProfileImageDoc,
  deleteProfileImageDoc,
};
