const admin = require('firebase-admin');

const serviceAccount = require("../../../serviceAccountKey.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "ec-2021-afe88.appspot.com",
});

const bucket = admin.storage().bucket();

module.exports = bucket;