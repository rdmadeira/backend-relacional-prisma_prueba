const admin = require('firebase-admin');

const serviceAccount = require('./privateKey.json');

module.exports = admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});
