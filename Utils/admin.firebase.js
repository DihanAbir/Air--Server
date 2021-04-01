const { serviceAccount } = require("./Private_key_generation");

exports.admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://athena-84a05.firebaseio.com",
});
