const mongoose = require("mongoose");

var GlobalSensor = mongoose.model(
    "GlobalSensor",SensorShema =
    new mongoose.Schema({
     
        code: String ,
      
        type : String ,
        
    })
);

module.exports = GlobalSensor;
