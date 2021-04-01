const express = require("express");
const { Users } = require("./Data");
require("dotenv").config();

const { client } = require("./Connections/mongo");

// check dotenv file
// console.log(process.env.DB_USER);

// required all middlewares
const bodyParser = require("body-parser");
var cors = require("cors");
const admin = require("firebase-admin");

const port = 4000;

// use
const app = express();

app.use(cors());
app.use(bodyParser.json());

// generate new private key from firebase
var serviceAccount = require("./athena-84a05-firebase-adminsdk-4epby-9694dff6f7.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://athena-84a05.firebaseio.com",
});

client.connect((err) => {
  // all collections
  const bookingsCollection = client.db("aircnc").collection("products");

  app.post("/addBooking", (req, res) => {
    const newBooking = req.body;
    bookingsCollection.insertOne(newBooking).then((result) => {
      res.send(result.insertedCount > 0);
    });
    // console.log(newBooking);
  });

  app.get("/bookings", (req, res) => {
    const bearer = req.headers.authorization;
    const email = req.query.email;
    // console.log(email, bearer);
    if (bearer && bearer.startsWith("Bearer")) {
      const idToken = bearer.split(" ")[1];
      // console.log(idToken);

      admin
        .auth()
        .verifyIdToken(idToken)
        .then((decodedToken) => {
          const tokenEmail = decodedToken.email;
          // console.log("tokenEmail");
          // console.log({ tokenEmail });

          if (tokenEmail == req.query.email) {
            bookingsCollection
              .find({ email: email })
              .toArray((err, documents) => {
                res.send(documents);
              });
          } else {
            res
              .status(401)
              .send(
                "Unauthorized status! You have no permission to access here!"
              );
          }
        })
        .catch((error) => {
          res
            .status(401)
            .send(
              "Unauthorized status! You have no permission to access here!"
            );
        });
    } else {
      res
        .status(401)
        .send("Unauthorized status! You have no permission to access here!");
    }
  });

  // get item using token done

  // regular get is like:
  app.get("/router-name", (req, res) => {
    const bearer = req.headers.authorization;
    const email = req.query.email;
    // console.log(email, bearer);
    bookingsCollection.find({ email: email }).toArray((err, documents) => {
      res.send(documents);
    });
  });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
