
const mongoose = require("mongoose");

var Smoke = mongoose.model(
"smoke",SensorShema =
new mongoose.Schema({
    userId : mongoose.Schema.Types.ObjectId ,
    code: String ,
    name: String,
   
    type : String ,
    factoryId : mongoose.Schema.Types.ObjectId ,
    factoryName :String ,
    state : Boolean ,
    batteryLevel : String ,
    area : String ,
    OnOf:Number,
})
);


module.exports = Smoke;

