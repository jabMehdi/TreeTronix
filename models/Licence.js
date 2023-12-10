const mongoose = require("mongoose");

var License = mongoose.model(
  "License",
  (licenseSchema = new mongoose.Schema({
    userid: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    factoryId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      default: "In progress",
    },
    activationKey: {
      type: String,
      required: true,
      unique: true,
    },
  }))
);

module.exports = License;
