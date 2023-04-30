const express = require("express");
const router = express.Router();
const Zone = require("../models/Zone");
var jwt = require("jsonwebtoken");

function verifyToken(req, res, next) {
  let payload;
  if (req.query.token === "null") {
    return res.status(401).send("Unauthorized request");
  }
  try {
    payload = jwt.verify(req.query.token, "tawfik");
  } catch (e) {
    return res.status(400).send("Invalid User");
  }
  if (!payload) {
    return res.status(401).send("Unauthorized request");
  }
  decoded = jwt.decode(req.query.token, { complete: true });
  req.id = decoded.payload.id;
  next();
}

router.post("/zone/add", (req, res) => {
  const newZone = new Zone({
    name: req.body.name,
    description: req.body.description,
    longitude: req.body.longitude,
    latitude: req.body.latitude,
  });

  newZone
    .save()
    .then((data) => {
      res.status(200).json({ message: "zone addes" });
    })
    .catch((err) => {
      res.status(404).json(err);
    });
});

router.get("/zone", (req, res) => {
  Zone.find({}, (err, data) => {
    if (err) {
      res.status(404).json(err);
    } else {
      res.status(200).json(data);
    }
  });
});

module.exports = router;
