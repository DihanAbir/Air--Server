const admin = require("firebase-admin");

exports.productpost = (req, res) => {
  const newBooking = req.body;
  bookingsCollection.insertOne(newBooking).then((result) => {
    res.send(result.insertedCount > 0);
  });
  // console.log(newBooking);
};

exports.productGet = (req, res) => {
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
          .send("Unauthorized status! You have no permission to access here!");
      });
  } else {
    res
      .status(401)
      .send("Unauthorized status! You have no permission to access here!");
  }
};
