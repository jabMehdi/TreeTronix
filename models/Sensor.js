const mongoose = require("mongoose");

var Sensor = mongoose.model(
  "Sensor",
  (SensorSchema = new mongoose.Schema({
    userId: mongoose.Schema.Types.ObjectId,
    code: String,
    name: String,
    data: [mongoose.Schema.Types.Mixed],
    Countersdata: [mongoose.Schema.Types.Mixed],
    ConsomationTripahse: [mongoose.Schema.Types.Mixed],
    PositiveTripahse: [mongoose.Schema.Types.Mixed],
    ReverserTipahse: [mongoose.Schema.Types.Mixed],
    ActivePowerTipahse: [mongoose.Schema.Types.Mixed],
    Voltage_CurrentrTipahse: [mongoose.Schema.Types.Mixed],
    type: String,
    factoryId: mongoose.Schema.Types.ObjectId,
    factoryName: String,
    state: Boolean,
    batteryLevel: String,
    area: String,
    status: Boolean,
    model: mongoose.Schema.Types.Mixed,
  }))
);
module.exports = Sensor;
