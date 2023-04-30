const mongoose = require("mongoose");

var Zone = mongoose.model(
  "Zone",
  (ZoneShema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    longitude: { type: Number, required: true },
    latitude: { type: Number, required: true },
  }))
);

module.exports = Zone;
