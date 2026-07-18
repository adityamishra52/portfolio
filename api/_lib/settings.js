const { getDb } = require("./mongodb");

const SETTINGS_COLLECTION = "site_settings";
const PROFILE_IMAGE_ID = "profile-image";

const getProfileImageDoc = async () => {
  const db = await getDb();
  return db.collection(SETTINGS_COLLECTION).findOne({ _id: PROFILE_IMAGE_ID });
};

const setProfileImageDoc = async ({ data, contentType }) => {
  const db = await getDb();
  await db.collection(SETTINGS_COLLECTION).updateOne(
    { _id: PROFILE_IMAGE_ID },
    { $set: { data, contentType, updatedAt: new Date() } },
    { upsert: true }
  );
};

const deleteProfileImageDoc = async () => {
  const db = await getDb();
  await db.collection(SETTINGS_COLLECTION).deleteOne({ _id: PROFILE_IMAGE_ID });
};

module.exports = {
  getProfileImageDoc,
  setProfileImageDoc,
  deleteProfileImageDoc,
};
