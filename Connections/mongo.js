const MongoClient = require("mongodb").MongoClient;

// mongooses connection is here
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.nngak.mongodb.net/aircnc?retryWrites=true&w=majority`;

exports.client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
// mongooses connection is here
