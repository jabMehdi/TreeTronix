const express = require("express");
const router = express.Router();
const Sensor = require("../models/Sensor");
const Factory = require("../models/Factory");
const Alert = require("../models/Alert");
const GlobalSensor = require("../models/GlobalSensor");
var jwt = require("jsonwebtoken");
const F = require("../models/Factory");
var nodemailer = require("nodemailer");
const moment = require("moment");

//const lib = require('./FactoryRoute');

const lib = require("../app");
const xxx = lib.socketId;
const { spawn } = require("child_process");
const smoke = require("../models/Smoke");
const http = require("http").Server(express);
//const io = require('socket.io')(http);
const app = express();
var server = app.listen(3010);
var io = require("socket.io").listen(server);
//const ioo = require('socket.io')(http);
const mongoose = require("mongoose");

const port = 3001;

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
router.post("/smok", async (req, res) => {
  try {
    console.log("SocketIDfromSmok: : " + socketId);
    //console.log("Device: "+sendDataFromSmoke())
    sendDataFromSmoke("5555555555555555").then((data) => {
      device = data;
      res.json(device);
    });
  } catch (err) {
    res.json({ message: err.message });
  }
});

async function sendDataFromSmoke(DevEUI) {
  var tm = new Date(Date.now()).getTime();
  var tramtos = {
    state: "1",

    time: tm,

    batteryLevel: "2.6",
  };
  device = await Sensor.findOne({ code: DevEUI });

  device.data.push(tramtos);
  await device.save();
  console.log("device: " + device);
  var tramto = {
    data: device.data[device.data.length - 1],
    factory: device.factoryName,
    type: device.type,
    area: device.area,
    code: device.code,
  };
  io.of("/Sensor/sm").to(socketId).emit("SetSmoke", tramto);

  return device;
}
var socketId;
const chatA = io.of("/Sensor/sm").on("connection", (socket) => {
  socketId = socket.id;
  console.log("socketId sent with code: " + socketId);
  let previousId;
  const safeJoin = (currentId) => {
    socket.leave(previousId);
    socket.join(currentId);
    previousId = currentId;
    console.log("user finaly connected");
  };

  socket.on("getDoc", (docId) => {
    console.log("doc sent");

    socketId = socket.id;
    module.exports = socketId;
    safeJoin(docId);
    socket.emit("documents", "SensorRouteIsFinalyResponding");
  });
});
// lel  mnehel edhaw
router.post("/AddSensorData", async (req, res) => {
  try {
    Sens = await Sensor.findOne({ code: req.body.code });
    delete req.body.code;
    req.body.time = Date.now();
    Sens.Countersdata.push(req.body);
    // console.log(Sens.data);
    await Sens.save();
    return res.status(200).json({ status: "ok", message: "updated" });
  } catch (e) {
    console.log("error AddSensor Data", e);
  }
});

router.post("/findAlert", async (req, res) => {
  try {
    Alert.find({}, function (err, list) {
      if (err) {
        res.json({ message: "error", status: "404" });
      } else {
        res.json(list);
      }
    });
  } catch (err) {
    res.json({ message: err.message });
  }
});
router.post("/sensor", async (req, res) => {
  let globalSensor = new GlobalSensor({
    code: req.body.code,
    type: req.body.type,
  });
  try {
    Sensor.findOne({ code: req.body.code }, async function (err, foundObject) {
      if (foundObject) {
        res.json({ status: "err", message: "Device already added" });
      } else {
        globalSensor
          .save()
          .then((item) => {
            res.send("item saved to database");
          })
          .catch((err) => {
            res.status(400).send("unable to save to database");
          });
      }
    });
  } catch (e) {
    console.log("error AddSensor Data", e);
  }
});

// find by code
router.post("/sensor/findByCode", verifyToken, async (req, res) => {
  try {
    const s = await Sensor.find({ code: req.body.code });

    if (s.length < 1) {
      await res.json({ status: "err", message: "not found" });
      return;
    }
    res.json(s);
  } catch (err) {
    res.json({ message: err.message });
  }
});
// find by type
router.post("/sensor/findByType", verifyToken, async (req, res) => {
  try {
    const s = await Sensor.find({
      type: req.body.type,
      userId: req.id,
      factoryId: req.body.factoryId,
    });
    const s1 = await Sensor.find({ type: req.body.type, userId: req.id });
    if (s.length > 0) {
      await res.json(s);

      return;
    }
    if (s.length < 1) {
      await res.json(s1);
      return;
    }
  } catch (err) {
    res.json({ message: err.message });
  }
});

// fin d by user
router.post("/sensor/findByUser", verifyToken, async (req, res) => {
  try {
    s = await Sensor.find({ userId: req.id });
    res.json(s);
    //  console.log("All sensor:" + s.code)
  } catch (err) {
    res.json({ message: err.message });
  }
});

// affectation
router.post("/sensor/updateSensor/", verifyToken, async (req, res) => {
  GlobalSensor.findOne(
    { code: req.body.code },
    async function (err, foundObject) {
      if (err) {
        res.json({ status: "err", message: "Error" });
      } else {
        if (!foundObject) {
          res.json({ status: "err", message: "Object not found" });
        } else {
          /* if (foundObject.factoryId != null) {
                     const deleteIdSensor = await F.findOneAndUpdate(
                         {_id: foundObject.factoryId},
                         {$pull: {sensorsId: {$in: [foundObject.id]}}}, false
                     );
 

                 }
                 foundObject.area = req.body.area;
                 foundObject.name = req.body.name;
                 foundObject.userId = req.id;
                 foundObject.factoryId = req.body.factoryId._id;
                 foundObject.isAffected = req.body.isAffected;
                 foundObject.factoryName = req.body.factoryId.name;
 
 
                 const update = await F.findByIdAndUpdate(
                     req.body.factoryId._id,
 
                     {
                         $addToSet: {
                             sensorsId: {$each: [foundObject.id]},
 
                         }
                     },
                     {new: true}
                 );
                 foundObject.save();*/
        }
      }
    }
  ).then((item) => {
    if (item == null) {
      res.json({ status: "err", message: "Object already added" });
    } else {
      Sensor.findOne(
        { code: item.code, factoryId: req.body.factoryId },
        async function (err, ObjectFoundinSensor) {
          if (err) {
            res.json({ status: "err", message: "Object not found" });
          } else {
            if (ObjectFoundinSensor == null) {
              let monoD = new Sensor({
                area: req.body.area,
                name: req.body.name,
                userId: req.id,
                factoryId: req.body.factoryId._id,
                isAffected: req.body.isAffected,
                factoryName: req.body.factoryId.name,
                Countersdata: [],
                ConsomationTripahse: [],
                ActivePowerTipahse: [],
                type: item.type,
                code: req.body.code,
              });

              monoD.save();
              res.json({ status: "success", message: "Object added " });
            } else {
              res.json({ status: "err", message: "Object not found" });
            }
          }
        }
      );
    }
  });
});

//database update sensors
router.post("/sensor/updateData", async (req, res) => {
  try {
    Sens = await Sensor.findOne({ code: req.body.code });

    delete req.body.code;
    req.body.time = Date.now();
    Sens.data.push(req.body);
    await Sens.save();
    updateClients_Soket(req.body, Sens);

    return res.status(200).json({ status: "ok", message: Sens });
  } catch (e) {}
});

// kafka
try {
  console.log("Trying to connect to Kafka Server .....");

  var Kafka = require("no-kafka");

  app.listen(port, function () {
    console.log("Server running on localhost:" + port);
    var consumer = new Kafka.SimpleConsumer({
      connectionString: "kafka.treetronix.com:9095",
      clientId: "no-kafka-client",
    });
    var dataHandler = function (messageSet, topic, partition) {
      messageSet.forEach(function (m) {
        console.log(
          topic,
          partition,
          m.offset,
          m.message.value.toString("utf8")
        );
        const obj = JSON.parse(m.message.value);
        check(obj);
        return io.emit("message", { y: m.message.value.toString("utf8") });
      });
    };
    return consumer.init().then(function () {
      // Subscribe partitons 0 and 1 in a topic:
      var v1 = consumer.subscribe("AS.Treetronix.v1", dataHandler);
      var arr = [];
      arr.push([v1]);

      var v2 = consumer.subscribe("AS.OrbitES.v1", dataHandler);
      var arr1 = [];
      arr1.push([v2]);

      console.log("val:" + arr);
      return arr;
    });
  });

  Sensor.find(async function (err, foundObject) {
    //console.log("All sensors kept from kafka server: " + foundObject)
  });
} catch (e) {
  console.log(e);
}
/*
async function Decoded(obj) {
  try {
    let decodedPayload;
    const device = await Sensor.findOne({ code: obj.DevEUI_uplink.DevEUI });
    if (device === null) {
      console.log("Unknown device!");
    } else {
      console.log("Device type:", device.type);

      if (device.type === "SD-100") {
        decodedPayload = DecoderSD100(
          obj.DevEUI_uplink.payload_hex,
          obj.DevEUI_uplink.DevEUI
        );
        console.log("Decoded payload from SD-100:", decodedPayload);
        device.data.push(decodedPayload);
        await device.save();
      } else if (device.type === "AN-103A") {
        decodedPayload = DecoderAN103A(
          obj.DevEUI_uplink.payload_hex,
          obj.DevEUI_uplink.DevEUI
        );
        console.log("Decoded payload from AN-103A:", decodedPayload);
        device.data.push(decodedPayload);
        await device.save();
      } else if (device.type === "AN-303") {
        decodedPayload = DecoderAN303(
          obj.DevEUI_uplink.payload_hex,
          obj.DevEUI_uplink.DevEUI
        );
        device.data.push(decodedPayload);
        await device.save();
        console.log("Decoded payload from AN-303:", decodedPayload);
      } else if (device.type === "AN-301") {
        decodedPayload = DecoderAN301(
          obj.DevEUI_uplink.payload_hex,
          obj.DevEUI_uplink.DevEUI
        );
        device.data.push(decodedPayload);
        await device.save();
        console.log("Decoded payload from AN-301:", decodedPayload);
      } else if (device.type === "AN-304C") {
        decodedPayload = DecoderAN304C(
          obj.DevEUI_uplink.payload_hex,
          obj.DevEUI_uplink.DevEUI
        );
        device.data.push(decodedPayload);
        await device.save();
        console.log("Decoded payload from AN-304C:", decodedPayload);
      } else if (device.type === "AN-305A") {
        decodedPayload = DecoderAN305A(
          obj.DevEUI_uplink.payload_hex,
          obj.DevEUI_uplink.DevEUI
        );
        device.data.push(decodedPayload);
        await device.save();
        console.log("Decoded payload from AN-305A:", decodedPayload);
      } else if (device.type === "AN-302") {
        decodedPayload = DecoderAN302(
          obj.DevEUI_uplink.payload_hex,
          obj.DevEUI_uplink.DevEUI
        );
        device.data.push(decodedPayload);
        await device.save();
        console.log("Decoded payload from AN-302:", decodedPayload);
      }
    }
  } catch (e) {
    // console.log(e);
  }
}
*/
//---------------------------------------------------------------------

async function check(obj) {
  try {
    device = await Sensor.findOne({ code: obj.DevEUI_uplink.DevEUI });
    if (device === null) {
      console.log("Unkown device !");
    } else {
      //console.log(obj)
      console.log("device", device.type);

      if (device.type === "Sensor") {
        CryptXtree(
          obj.DevEUI_uplink.payload_hex,
          obj.DevEUI_uplink.DevEUI,
          obj.DevEUI_uplink.Time
        );
      } else if (
        device.type === "mono" ||
        device.type === "triphase" ||
        device.type === "WaterMeter"
      ) {
        compteurCrypt(obj.DevEUI_uplink.payload_hex, obj.DevEUI_uplink.DevEUI);
      } else if (device.type == "SD-100") {
        CryptSmoke(
          obj.DevEUI_uplink.payload_hex,
          obj.DevEUI_uplink.DevEUI,
          obj.DevEUI_uplink.Time
        );
      } else if (device.type === "AN-103A") {
        CryptXTreeEXTER(
          obj.DevEUI_uplink.payload_hex,
          obj.DevEUI_uplink.DevEUI,
          obj.DevEUI_uplink.Time
        );
      } else if (device.type === "AN-303") {
        CryptAN303(
          obj.DevEUI_uplink.payload_hex,
          obj.DevEUI_uplink.DevEUI,
          obj.DevEUI_uplink.Time
        );
      } else if (device.type === "AN-301") {
        CryptSOSalarm(
          obj.DevEUI_uplink.payload_hex,
          obj.DevEUI_uplink.DevEUI,
          obj.DevEUI_uplink.Time
        );
      } else if (device.type === "AN-304C") {
        CryptMotion(
          obj.DevEUI_uplink.payload_hex,
          obj.DevEUI_uplink.DevEUI,
          obj.DevEUI_uplink.Time
        );
      } else if (device.type === "AN-305A") {
        CryptWindowDoorContact(
          obj.DevEUI_uplink.payload_hex,
          obj.DevEUI_uplink.DevEUI,
          obj.DevEUI_uplink.Time
        );
      } else if (device.type === "AN-302") {
        CryptGAZ(
          obj.DevEUI_uplink.payload_hex,
          obj.DevEUI_uplink.DevEUI,
          obj.DevEUI_uplink.Time
        );
      } else if (device.type === "LT-22222-L") {
        cryptLT2(
          obj.DevEUI_uplink.payload_hex,
          obj.DevEUI_uplink.DevEUI,
          obj.DevEUI_uplink.Time
        );
      }
    }
  } catch (e) {
    // console.log(e);
  }
}

async function CryptGAZ(data, DevEUI, time) {
  // console.log("trame: " + data);
  //  console.log("Sensor Id: " + DevEUI)
  //  console.log("time: " + time)
  DeviceID = parseInt(data.substring(0, 2), 16);
  SensorType = parseInt(data.substring(2, 4), 16);
  FrameFormat = parseInt(data.substring(4, 6), 16);
  Status = hex2bin(data.substring(6, 8));
  satutsBButon = Status.substring(0, 3);
  satutsDismantle = Status.substring(3, 4);
  satutsBatterie = Status.substring(5, 7);
  SensorVal = Status.substring(7, 9);
  const FTime = moment(time).format("YYYY-MM-DD HH:mm:ss");
  var tram = {
    satutsDismantle: +satutsDismantle,
    Status: +Status,
    SatutsBButon: +satutsBButon,
    SatutsDismantle: +satutsDismantle,
    SatutsBatterie: +satutsBatterie,
    SensorValue: +SensorVal,
    time: FTime,
    type: "AN-302",
  };
  console.log("-----------Hans Volter-----------");
  console.log("Type: AN-302");
  console.log("-----------Hans Volter-----------");

  await Sensor.updateMany({ code: DevEUI }, { $push: { data: tram } });
  const updatedSensors = await Sensor.find({ code: DevEUI });
  updateClients_Soket(tram, updatedSensors);
}

async function CryptMotion(data, DevEUI, time) {
  // console.log("trame: " + data);
  //  console.log("Sensor Id: " + DevEUI)
  //  console.log("time: " + time)
  SensorType = parseInt(data.substring(0, 2), 16);
  FrameType = parseInt(data.substring(2, 4), 16);
  SensorStatus = parseInt(data.substring(4, 6), 16);
  SwitchStatus = parseInt(data.substring(6, 8), 16);
  BatteryVolatage = parseInt(data.substring(8, 10), 16) / 10;
  const FTime = moment(time).format("YYYY-MM-DD HH:mm:ss");
  var tram = {
    SensorStatus: +SensorStatus,
    SwitchStatus: +SwitchStatus,
    BatteryVolatage: +BatteryVolatage,
    time: FTime,
    type: "AN-304C",
  };
  console.log("-----------Ghost-----------");
  console.log("Type: AN-304C");
  console.log("-----------Ghost-----------");

  await Sensor.updateMany({ code: DevEUI }, { $push: { data: tram } });
  const updatedSensors = await Sensor.find({ code: DevEUI });
  updateClients_Soket(tram, updatedSensors);
}

async function CryptWindowDoorContact(data, DevEUI, time) {
  // console.log("trame: " + data);
  //  console.log("Sensor Id: " + DevEUI)
  //  console.log("time: " + time)
  SensorType = parseInt(data.substring(0, 2), 16);
  FrameType = parseInt(data.substring(2, 4), 16);
  TamperStatus = parseInt(data.substring(4, 6), 16);
  DoorContactStatus = parseInt(data.substring(6, 8), 16);
  BatteryLevel = parseInt(data.substring(8, 10), 16) / 10;
  const FTime = moment(time).format("YYYY-MM-DD HH:mm:ss");
  //  console.log("Smoke State: " + state);
  //  console.log("Smoke battery: " + batterylevel)
  var tram = {
    DoorContactStatus: +DoorContactStatus,
    BatteryLevel: +BatteryLevel,
    time: FTime,
    type: "AN-305A",
  };
  console.log("-----------Windows-----------");
  console.log("Type:AN-305A");
  console.log("-----------Windows-----------");

  await Sensor.updateMany({ code: DevEUI }, { $push: { data: tram } });
  const updatedSensors = await Sensor.find({ code: DevEUI });
  updateClients_Soket(tram, updatedSensors);
}

async function CryptSOSalarm(data, DevEUI, time) {
  // console.log("trame: " + data);
  //  console.log("Sensor Id: " + DevEUI)
  //  console.log("time: " + time)
  SensorType = parseInt(data.substring(0, 2), 16);
  FrameType = parseInt(data.substring(2, 4), 16);
  AlarmState = parseInt(data.substring(4, 6), 16);
  StateDismantling = parseInt(data.substring(6, 8), 16);
  Voltage = parseInt(data.substring(8, 10), 16) / 10;
  const FTime = moment(time).format("YYYY-MM-DD HH:mm:ss");

  var tram = {
    AlarmState: +AlarmState,
    StateDismantling: +StateDismantling,
    Voltage: +Voltage,
    time: FTime,
    type: "AN-301",
  };
  console.log("-----------SOS-----------");
  console.log("Type: AN-301");
  console.log("-----------SOS-----------");

  var email;
  Alert.find({}, function (err, list) {
    if (err) {
      console.log("alert error");
    } else {
      console.log("alert: " + list);

      for (i = 0; i < list.length; i++) {
        email = list[i].email;
        if (AlarmState == 0) {
          console.log("no alert to be send");
        } else if (AlarmState == 1) {
          console.log("alert to sent ");
          sendEmail(email, temp, "", "has detected", list[i].deviceName);
        } else {
          console.log("delay reporting of the alarm");
        }

        console.log("alert list!" + i + " :" + list[i]);
      }
    }
  });

  if (AlarmState == 0) {
    console.log("without alarm");
  } else if (AlarmState == 1) {
    console.log("with alarm");
  } else {
    console.log("delay reporting of the alarm");
  }

  await Sensor.updateMany({ code: DevEUI }, { $push: { data: tram } });
  const updatedSensors = await Sensor.find({ code: DevEUI });
  updateClients_Soket(tram, updatedSensors);
}

async function CryptAN303(data, DevEUI, time) {
  DeviceID = parseInt(data.substring(0, 2), 16);
  Frameformat = parseInt(data.substring(2, 4), 16);
  Antidismantle = parseInt(data.substring(4, 6), 16);
  tempStatus = parseInt(data.substring(6, 8), 16);
  TempValues = parseInt(data.substring(22, 26), 16) / 100;
  humStatus = parseInt(data.substring(12, 14), 16);

  HumValues = parseInt(data.substring(28, 32), 16) / 10;

  Voltage = parseInt(data.substring(8, 12), 16) / 1000;

  const FTime = moment(time).format("YYYY-MM-DD HH:mm:ss");

  tram = {
    TempValues: +TempValues,
    HumValues: +HumValues,
    Voltage: +Voltage,
    time: FTime,
    type: "AN-303",
  };

  console.log("-----------MOGHT-----------");
  console.log("Type: AN-303");
  console.log("-----------MOGHT-----------");

  var email;
  Alert.find({}, function (err, list) {
    if (err) {
      console.log("alert error");
    } else {
      console.log("alert: " + list);

      for (i = 0; i < list.length; i++) {
        email = list[i].email;
        if (temp > list[i].min && temp < list[i].max) {
          console.log("no alert to be send");
        } else {
          console.log(
            "alert to sent temp: " +
              temp +
              " max: " +
              list[i].max +
              " min: " +
              list[i].min
          );
          console.log("list email: " + email);
          sendEmail(email, temp, "", "has detected", list[i].deviceName);
        }

        console.log("alert list!" + i + " :" + list[i]);
      }
    }
  });

  await Sensor.updateMany({ code: DevEUI }, { $push: { data: tram } });
  const updatedSensors = await Sensor.find({ code: DevEUI });
  updateClients_Soket(tram, updatedSensors);
}

async function CryptSmoke(data, DevEUI, time) {
  // console.log("trame: " + data);
  //  console.log("Sensor Id: " + DevEUI)
  //  console.log("time: " + time)

  // Extract status
  hexString = data.substring(4, 8);
  const intValue = parseInt(hexString, 16); // convert hex string to integer
  const binaryString = intValue.toString(2).padStart(16, "0"); // convert integer to binary string with leading zeros

  voltageAlarm = parseInt(binaryString.substring(15, 16), 10);
  tamperAlarm = parseInt(binaryString.substring(3, 4), 10);
  faultAlarm = parseInt(binaryString.substring(5, 6), 10);
  smokeAlarm = parseInt(binaryString.substring(6, 7), 10);
  //Battery
  BatteryString = payload.substring(12, 16);
  const swappedString = BatteryString.slice(2) + BatteryString.slice(0, 2);
  const batteryLevel = parseInt(swappedString, 16) / 1000;

  const FTime = moment(time).format("YYYY-MM-DD HH:mm:ss");
  //  console.log("Smoke State: " + state);
  var tram = {
    state: +smokeAlarm,
    voltage: +voltageAlarm,
    tamper: +tamperAlarm,
    type: "SD-100",
    time: FTime,
    batteryLevel: +batteryLevel,
  };

  console.log("-----------NOOB-----------");
  console.log("Type: SD-100");
  console.log("-----------NOOB-----------");

  device = await Sensor.findOne({ code: DevEUI });
  device.data.push(tram);
  await device.save();
  var tramto = {
    data: device.data[device.data.length - 1],
    factory: device.factoryName,
    type: device.type,
    area: device.area,
    code: device.code,
  };
  io.of("/Sensor/sm").to(socketId).emit("SetSmoke", tramto);
}
function sendEmail(receiver, value, status, data, name) {
  var result = "";
  var transporter = nodemailer.createTransport({
    service: "Gmail",

    auth: {
      user: "mechergui.ba@gmail.com",
      pass: "hbdafvqoccuhutga",
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  var mailOptions = {
    from: "mechergui.ba@gmail.com",
    to: receiver,
    subject: status + " Notification from Usina",
    text: " Sensor   " + name + " " + data + " " + value,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
  return result;
}

function hex2bin(hex) {
  return parseInt(hex, 16).toString(2).padStart(8, "0");
}

function cryptHassine(data, DevEUI, time) {
  obj = {};
  obj.IdSensor = data.substring(0, 2);
  obj.SType = data.substring(2, 4);
  obj.FrameForm = data.substring(4, 6);
  obj.Status = hex2bin(data.substring(6, 8));
  //SensorValue = Date.parse(time);

  obj.satutsBButon = obj.Status.substring(0, 3);
  obj.satutsDismantle = obj.Status.substring(3, 4);
  obj.satutsBatterie = obj.Status.substring(5, 7);
  obj.satutsSensor = obj.Status.substring(7, 9);
  console.log(obj);
  return obj;
}

async function CryptXTreeEXTER(data, DevEUI, time) {
  //console.log(data);
  //console.log(DevEUI);

  DeviceID = parseInt(data.substring(0, 2), 16);
  Frameformat = parseInt(data.substring(2, 4), 16);
  Antidismantle = parseInt(data.substring(4, 6), 16);
  tempStatus = parseInt(data.substring(6, 8), 16);
  temp = parseInt(data.substring(8, 12), 16) / 10;
  humStatus = parseInt(data.substring(12, 14), 16);

  hum = parseInt(data.substring(14, 18), 16) / 10;

  voltage = parseInt(data.substring(18, 22), 16) / 100;

  const FTime = moment(time).format("YYYY-MM-DD HH:mm:ss");
  /*
   console.log("Time: " + tm);
     console.log('Temperature: ', temp);
     console.log('Humidity', hum);
     console.log('Battery level', batterie);
*/
  tram = {
    tempValues: +temp,
    humValues: +hum,
    voltage: +voltage,
    time: FTime,
    type: "AN-103A",
  };
  console.log("-------------EXTRA CRUNCHY-------------");
  console.log("AN-103A");
  console.log("-------------EXTRA CRUNCHY-------------");

  var email;
  Alert.find({}, function (err, list) {
    if (err) {
      console.log("alert error");
    } else {
      console.log("alert: " + list);

      for (i = 0; i < list.length; i++) {
        email = list[i].email;
        if (temp > list[i].min && temp < list[i].max) {
          console.log("no alert to be send");
        } else {
          console.log(
            "alert to sent temp: " +
              temp +
              " max: " +
              list[i].max +
              " min: " +
              list[i].min
          );
          console.log("list email: " + email);
          sendEmail(email, temp, "", "has detected", list[i].deviceName);
        }

        console.log("alert list!" + i + " :" + list[i]);
      }
    }
  });

  await Sensor.updateMany({ code: DevEUI }, { $push: { data: tram } });
  const updatedSensors = await Sensor.find({ code: DevEUI });
  updateClients_Soket(tram, updatedSensors);
}

async function CryptAN202A(data, DevEUI, time) {
  //console.log(data);
  //console.log(DevEUI);

  SensorType = parseInt(data.substring(0, 2), 16);
  FrameType = parseInt(data.substring(2, 4), 16);
  BatteryVoltage = parseInt(data.substring(4, 6), 16);
  tempStatus = parseInt(data.substring(6, 8), 16);
  temp = parseInt(data.substring(8, 12), 16) / 10;
  humStatus = parseInt(data.substring(12, 14), 16);

  hum = parseInt(data.substring(14, 18), 16) / 10;

  voltage = parseInt(data.substring(18, 22), 16) / 100;

  var tm = Date.parse(time);
  var time = tm.toLocaleString();

  /* console.log("Time: " + tm)
     console.log('Temperature: ', temp);
     console.log('Humidity', hum);
     console.log('Battery level', batterie);*/

  tram = {
    DeviceID: +DeviceID,
    Frameformat: +Frameformat,
    Antidismantle: Antidismantle,
    tempStatus: +tempStatus,
    tempValues: +temp,
    humStatus: +humStatus,
    humValues: +hum,
    voltage: +voltage,
    time: +time,
    type: "AN-103A",
  };

  console.log("-------------THE CRUNCH-------------");
  console.log("AN-103A");
  console.log("-------------THE CRUNCH-------------");

  var email;
  Alert.find({}, function (err, list) {
    if (err) {
      console.log("alert error");
    } else {
      console.log("alert: " + list);

      for (i = 0; i < list.length; i++) {
        email = list[i].email;
        if (temp > list[i].min && temp < list[i].max) {
          console.log("no alert to be send");
        } else {
          console.log(
            "alert to sent temp: " +
              temp +
              " max: " +
              list[i].max +
              " min: " +
              list[i].min
          );
          console.log("list email: " + email);
          sendEmail(email, temp, "", "has detected", list[i].deviceName);
        }

        console.log("alert list!" + i + " :" + list[i]);
      }
    }
  });

  await Sensor.updateMany({ code: DevEUI }, { $push: { data: tram } });
  const updatedSensors = await Sensor.find({ code: DevEUI });
  updateClients_Soket(tram, updatedSensors);
}

function temphum103acrypt(data, DevEUI, time) {
  obj = {};
  obj.IdSensor = data.substring(0, 2);
  obj.FrameForm = data.substring(2, 4);
  obj.SDismantle = data.substring(4, 6);
  obj.STemp = data.substring(6, 8);
  obj.Temp1 = hex2bin(data.substring(8, 10));
  obj.Temp2 = hex2bin(data.substring(10, 12));
  obj.SHum = data.substring(12, 14);
  obj.HumValue1 = hex2bin(data.substring(14, 16));
  obj.HumValue2 = hex2bin(data.substring(16, 18));
  obj.HighTemp = parseInt(obj.Temp1, 2);
  obj.LowTemp = parseInt(obj.Temp2, 2);
  obj.TempFinal = `${obj.HighTemp}${obj.LowTemp}` / 10;
  obj.HumFinal =
    `${(parseInt(obj.HumValue1), 2)}${(parseInt(obj.HumValue2), 2)}` / 10;
  console.log(obj);
  return obj;
}

/* function cryptHassine305a(data, DevEUI, time) {
  obj = {};
  obj.IdSensor = data.substring(0, 2);
  obj.FrameType = data.substring(2, 4);
  obj.STamper = data.substring(4, 6);
  obj.SDoorContact = data.substring(6, 8);
  obj.BatteryLevel = parseInt(data.substring(8, 10), 16) / 10;

  //SensorValue = Date.parse(time);

  console.log(obj);
  return obj;
} */

function cryptHassinean304c(data, DevEUI, time) {
  obj = {};
  obj.IdSensor = data.substring(0, 2);
  obj.FrameType = data.substring(2, 4);
  obj.SSensor = data.substring(4, 6);
  obj.SDismantle = data.substring(6, 8);
  obj.BatteryLevel = parseInt(data.substring(8, 10), 16) / 10;

  //SensorValue = Date.parse(time);
  console.log(obj);
  return obj;
}

function cryptHassineLT2(data, DevEUI, time) {
  obj = {};
  obj.AVI1 = parseInt(data.substring(0, 2), 16) / 1000;
  obj.AVI2 = parseInt(data.substring(2, 4), 16) / 1000;
  obj.ACI1 = parseInt(data.substring(4, 6), 16) / 1000;
  obj.ACI2 = parseInt(data.substring(6, 8), 16) / 1000;
  obj.Status = parseInt(data.substring(6, 8), 2);
  obj.RO1 = obj.status.substring(0, 1);
  obj.RO2 = obj.status.substring(1, 2);
  obj.DI3 = obj.status.substring(2, 3);
  obj.DI2 = obj.status.substring(3, 4);
  obj.DI1 = obj.status.substring(4, 5);
  obj.DI22 = obj.status.substring(5, 6);

  console.log(obj);
  return obj;
}

function cryptHassine303(data, DevEUI, time) {
  obj = {};
  obj.IdSensor = data.substring(0, 2);
  obj.FrameForm = data.substring(2, 4);
  obj.SDismantle = data.substring(4, 6);
  obj.STemp = data.substring(6, 8);
  obj.Temp1 = hex2bin(data.substring(8, 10));
  obj.Temp2 = hex2bin(data.substring(10, 12));
  obj.SHum = data.substring(12, 14);
  obj.HumValue1 = hex2bin(data.substring(14, 18));
  pbj.HumValue2 = hex2bin(data.substring(14, 18));
  //SensorValue = Date.parse(time);

  obj.HighTemp = parseInt(obj.Temp1, 2);
  obj.LowTemp = parseInt(obj.Temp2, 2);
  obj.TempFinal = `${obj.LowTemp}${obj.HighTemp}`;
  obj.HumFinal = `${(parseInt(obj.HumValue2), 2)}${
    (parseInt(obj.HumValue1), 2)
  }`;

  console.log(obj);
  return obj;
}

function cryptHassine301(data, DevEUI, time) {
  obj = {};
  obj.IdSensor = data.substring(0, 2);
  obj.FrameType = data.substring(2, 4);
  obj.AlarmState = data.substring(4, 6);
  obj.SDismantle = data.substring(6, 8);
  obj.BatteryLevel = parseInt(data.substring(8, 10), 16) / 10;

  //SensorValue = Date.parse(time);

  console.log(obj);
  return obj;
}

async function CryptXtree(data, DevEUI, time) {
  //console.log(data);
  //console.log(DevEUI);

  temp = parseInt(data.substring(0, 4), 16) / 100;
  hum = parseInt(data.substring(4, 8), 16) / 100;
  v = parseInt(data.substring(8, 10), 16);
  batterie = ((v - 30) / 12) * 100;
  const FTime = moment(time).format("YYYY-MM-DD HH:mm:ss");

  /* console.log("Time: " + tm)
     console.log('Temperature: ', temp);
     console.log('Humidity', hum);
     console.log('Battery level', batterie);*/
  tram = {
    energy: 6,
    type: "Sensor",
    state: "",
    time: +time,
    humValues: +hum,
    tempValues: +temp,
    batteryLevel: +batterie,
  };
  console.log("temperature: " + temp);
  var email;
  Alert.find({}, function (err, list) {
    if (err) {
      console.log("alert error");
    } else {
      console.log("alert: " + list);

      for (i = 0; i < list.length; i++) {
        email = list[i].email;
        if (temp > list[i].min && temp < list[i].max) {
          console.log("no alert to be send");
        } else {
          console.log(
            "alert to sent temp: " +
              temp +
              " max: " +
              list[i].max +
              " min: " +
              list[i].min
          );
          console.log("list email: " + email);
          sendEmail(email, temp, "", "has detected", list[i].deviceName);
        }

        console.log("alert list!" + i + " :" + list[i]);
      }
    }
  });

  const sensors = await Sensor.find({ code: DevEUI });
  for (const sensor of sensors) {
    sensor.data.push(tram);
    await sensor.save();
    updateClients_Soket(tram, sensor);
  }
}

async function compteurCrypt(Crypteddata, DevEUI) {
  /*   console.log('data compteur ', Crypteddata);
       console.log('dev ui', DevEUI);
   */
  var dataToSend = null;
  const python3 = await spawn("python3", [
    "routes/decrypt.py",
    Crypteddata,
    "python3",
  ]);
  python3.stdout.on("data", function (data) {
    dataToSend = data.toString();
    //  console.log("dataTosendFromOnStart: "+dataToSend)
  });
  python3.on("close", (code) => {
    //console.log(`child process close all stdio with code ${code}`);

    //mono countersdata 384
    //tri positivractive 483
    //console.log("dataTosendFromOnClose: "+dataToSend)
    if (dataToSend != null) {
      if (!JSON.parse(dataToSend)) {
        //   console.log("dataToSend"+dataToSend)
        return;
      }

      const datatram = JSON.parse(dataToSend);
      //console.log(datatram);
      UpdateCounters(datatram, DevEUI);
      // console.log(obj.Address);
    }
  });
}

async function UpdateCounters(val, code) {
  Sens = await Sensor.findOne({ code: code });
  delete val.code;
  val.time = Date.now();
  if (val.DataIdentification == "0000FF00") {
    //    console.log('consomation');
    Sens.ConsomationTripahse.push(val);
  } else if (val.DataIdentification == "0001FF00") {
    //   console.log('positive');
    Sens.PositiveTripahse.push(val);
  } else if (val.DataIdentification == "0002FF00") {
    //   console.log('resverse');
    Sens.ReverserTipahse.push(val);
  } else if (val.DataIdentification == "04601201") {
    //   console.log('resverse');
    Sens.Voltage_CurrentrTipahse.push(val);
  } else {
    //  console.log('actif power');
    Sens.ActivePowerTipahse.push(val);
  }
  Sens.Countersdata.push(val); // delete
  await Sens.save();
  updateClients_Soket(val, Sens);
}

router.delete("/sensor/delete/:id", (req, res) => {
  Sensor.findByIdAndRemove(req.params.id).then((sensor) => {
    if (!sensor) {
      return res.status(404).send({
        message: "sensor not found with code " + req.params.id,
      });
    }
  });
});

router.post("/sensor/all/all", verifyToken, async (req, res) => {
  try {
    const s = await Sensor.find({ userId: req.id });
    res.json(s);
    //  console.log("All sensor:" + s)
  } catch (err) {
    res.json({ message: err.message });
  }
});

router.post("/sensor/all", verifyToken, async (req, res) => {
  try {
    const s = await Sensor.find({ type: req.body.type, userId: req.id });
    res.json(s);
    //  console.log("All sensor:" + s)
  } catch (err) {
    res.json({ message: err.message });
  }
});

// sensor delete data by ID

router.post("/sensor/Data_remID/:id", async (req, res) => {
  try {
    const id = req.params.id;

    // Find the sensor by ID
    const sensor = await Sensor.findById(id);

    if (!sensor) {
      return res.status(404).json({ error: "Sensor not found" });
    }
    console.log("Found Sensor:", sensor);

    // Delete the sensor's data
    sensor.data = [];
    await sensor.save();

    return res.status(200).json({ message: "Data deleted successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/sensor/Data_remAll", async (req, res) => {
  try {
    // Find all sensors
    const sensors = await Sensor.find();
    // Iterate over each sensor
    for (const sensor of sensors) {
      // Get the length of the data array
      const dataLength = sensor.data.length;

      // Check if the data array has more than 50 objects
      if (dataLength > 50) {
        // Keep only the last 50 objects in the data array
        sensor.data = sensor.data.slice(dataLength - 50);
      }

      // Save the updated sensor
      await sensor.save();
    }

    // Return success response
    res.json({ message: "Data deleted successfully" });
  } catch (error) {
    // Return error response
    res.status(500).json({ error: "An error occurred" });
  }
});

router.post("/sensor/Data_remAll-f", async (req, res) => {
  try {
    // Find all sensors
    const sensors = await Sensor.find();

    // Iterate over each sensor
    for (const sensor of sensors) {
      // Set the data array to an empty array
      sensor.data = [];

      // Save the updated sensor
      await sensor.save();
    }

    // Return success response
    res.json({ message: "Data deleted successfully" });
  } catch (error) {
    // Return error response
    res.status(500).json({ error: "An error occurred" });
  }
});

//Display THE Decoded Data
router.post("/sensor/data/:code/:sensorId", async (req, res) => {
  try {
    const sensorCode = req.params.code;
    const sensorId = req.params.sensorId;

    // Find the sensor by code and unique identifier
    const sensor = await Sensor.findOne({ code: sensorCode, _id: sensorId });

    if (!sensor) {
      return res.status(404).json({ message: "Sensor not found" });
    }
    // Retrieve the data array of the sensor
    const sensorData = sensor.data;

    // Return the sensor data
    res.json(sensorData);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

//SensorByFactory
router.post("/sensor/byArea", verifyToken, async (req, res) => {
  try {
    const s = await Sensor.find({ userId: req.id, area: req.body.area });
    res.json(s);
    //  console.log("sensor by factory:" + s)
  } catch (err) {
    res.json({ message: err.message });
  }
});

// find and update (tna7i user id w factory id)
router.post(
  "/sensor/updateUserAndFactory/:code",
  verifyToken,
  async (req, res) => {
    try {
      const DeletedSensor = await Sensor.deleteOne({ code: req.params.code });
      console.log(
        `${DeletedSensor.deletedCount} document(s) was/were deleted.`
      );
    } catch (err) {
      res.json({ message: err.message });
    }
  }
);

// service change state in data base of actioneur !
router.post("/sensor/updateState", verifyToken, async (req, res) => {
  const updateState = await Sensor.findOneAndUpdate(
    { code: req.body.code },
    {
      $addToSet: {
        state: req.body.state,
      },
    },
    { new: false }
  );

  await res.json(updateState);
});
// affiche all actioneurs states
router.post("/sensor/actuator/", verifyToken, async (req, res) => {
  try {
    s = Sensor.findOne(
      { code: req.body.code },
      async function (err, foundObject) {
        foundObject.state = req.body.state;
        foundObject.save();
      }
    );
    res.json(s);
  } catch (err) {
    res.json({ message: err.message });
  }
});

// update device
router.post("/sensor/update/", verifyToken, async (req, res) => {
  const dev = await Sensor.findById({ _id: req.body.id });

  if (req.body.name != null) {
    dev.name = req.body.name;
  }
  if (req.body.area != null) {
    dev.area = req.body.area;
  }
  dev.save();

  await res.json(dev);
});

SocketClients = [];
const chat = io.of("/Sensor/UpdateValue").on("connection", (socket) => {
  socket.on("smokeConnexion", async (message) => {
    console.log("smokeConnexion: " + message);
  });

  socket.on("getChartdata", async (message) => {
    if (SocketClients.length === 0) {
      let clientInfo = {};
      clientInfo.socketId = socket.id;
      clientInfo.token = message.Accesstoken;
      SocketClients.push(clientInfo);
    } else {
      let exist = false;
      SocketClients.forEach((item) => {
        if (item.socketId === socket.id) {
          if (item.token === message.Accesstoken) {
            {
              exist = true;
              console.log("SocketClients ", SocketClients);
            }
          }
        }
      });
      if (exist === false) {
        //console.log('create 2');
        let clientInfo = {};
        clientInfo.socketId = socket.id;
        clientInfo.token = message.Accesstoken;
        SocketClients.push(clientInfo);
      }
    }
    console.log("Socket Clients", SocketClients);
  });
  socket.on("getData", (message) => {});

  socket.on("disconnect", (message) => {
    let i = 0;
    SocketClients.forEach((item) => {
      if (item.socketId === socket.id) SocketClients.splice(i, 1);
      i++;
    });
  });
});

/*
//   Decoder for  SD100
function DecoderSD100(bytes, port) {
  var decoded = {};

  decoded.sensorName = "SD100";
  if (checkReportSync(bytes) == false) return;

  var status = byteToUint16Swap(bytes.slice(2, 4));

  decoded.voltageAlarm = (status >> 8) & 0x01;
  decoded.tamperAlarm = (status >> 4) & 0x01;
  decoded.faultAlarm = (status >> 2) & 0x01;
  decoded.smokeAlarm = (status >> 1) & 0x01;

  var dataLen = bytes[4];
  var i = 5;

  while (dataLen--) {
    var type = bytes[i];
    i++;
    switch (type) {
      case 0x88: // battery /mv
        decoded.battery = byteToUint16Swap(bytes.slice(i, i + 2));
        i += 2;
        break;
      case 0x03: // temperature /0.1℃
        decoded.temperature = byteToUint16Swap(bytes.slice(i, i + 2)) / 10;
        i += 2;
        break;
      case 0xff: // report interval /min
        decoded.reportInterval = byteToUint16Swap(bytes.slice(i, i + 2));
        i += 2;
        break;
    }
  }
  return decoded;
}

function byteToUint16Swap(bytes) {
  var value = (bytes[1] << 8) | bytes[0];
  return value;
}

function checkReportSync(bytes) {
  if (bytes[0] == 0x01 && bytes[1] == 0x28) {
    return true;
  }
  return false;
}

//END OF DECODER

// DECODER OF AN103A------------------------------------------------------

function DecoderAN103A(bytes, port) {
  var decoded = {};

  decoded.sensorName = "AN103A";
  decoded.deviceId = 0x01; // fixed value

  switch (bytes[1]) {
    case 0x00:
      decoded.frameFormat = "Heartbeat frame";
      break;
    case 0x01:
      decoded.frameFormat = "Data frame";
      break;
    default:
      decoded.frameFormat = "Unknown";
  }

  decoded.antiDismantle = bytes[2] === 0x01 ? "Dismantled" : "Not dismantled";

  switch (bytes[3]) {
    case 0x00:
      decoded.tempStatus = "Normal";
      break;
    case 0x01:
      decoded.tempStatus = "High temperature threshold alarm";
      break;
    case 0x02:
      decoded.tempStatus = "Low temperature threshold alarm";
      break;
    default:
      decoded.tempStatus = "Unknown";
  }

  var temperature = ((bytes[4] << 8) | bytes[5]) / 10;
  if (bytes[4] & 0x80) {
    // check the sign bit
    temperature = -(0x1000 - temperature); // convert to signed int
  }
  decoded.temperature = temperature;

  switch (bytes[6]) {
    case 0x00:
      decoded.humidityStatus = "Normal";
      break;
    case 0x01:
      decoded.humidityStatus = "High humidity";
      break;
    case 0x02:
      decoded.humidityStatus = "Low humidity";
      break;
    default:
      decoded.humidityStatus = "Unknown";
  }

  decoded.humidity = ((bytes[7] << 8) | bytes[8]) / 10;

  var power = ((bytes[9] << 8) | bytes[10]) / 100;
  decoded.powerStatus = (bytes[9] & 0x80) === 0x80 ? "Low power" : "Normal";
  decoded.power = power;

  return decoded;
}

// end of decoder-------------------------------------------------------------------------------------

// AN304C--------------------
function DecoderAN304C(bytes, port) {
  var decoded = {};
  decoded.sensorName = "AN304C";
  decoded.deviceId = 0x01; // fixed value
  decoded.sensorType = "AN-304C"; // fixed value

  decoded.sensorStatus = bytes[2] === 0x01 ? "Triggered" : "Not Triggered";
  decoded.antiDismantle = bytes[3] === 0x01 ? "Dismantled" : "Not Dismantled";
  decoded.switchStatus = bytes[4] === 0x01 ? "On" : "Off";

  decoded.batteryVoltage = (bytes[5] / 10).toFixed(1);

  return decoded;
}

// END------------------------

// Decoder for AN302 GAS-----------------------------
function DecoderAN302(bytes) {
  var decoded = {};

  decoded.sensorName = "AN302";
  decoded.deviceId = 0x02; // fixed value
  decoded.sensorType = 0x02; // fixed value

  switch (bytes[2]) {
    case 0x00:
      decoded.frameFormat = "Heartbeat packet";
      break;
    case 0x01:
      decoded.frameFormat = "Status change packet";
      break;
    default:
      decoded.frameFormat = "Unknown";
  }

  var statusByte = bytes[3];
  var sensorStatus = (statusByte & 0xc0) >> 6;
  switch (sensorStatus) {
    case 0x00:
      decoded.sensorStatus = "Normal status";
      break;
    case 0x01:
      decoded.sensorStatus = "Alarm status";
      break;
    case 0x02:
      decoded.sensorStatus = "Failure status";
      break;
    case 0x03:
      decoded.sensorStatus = "Warm up status";
      break;
    default:
      decoded.sensorStatus = "Unknown";
  }

  var batteryStatus = (statusByte & 0x30) >> 4;
  switch (batteryStatus) {
    case 0x00:
      decoded.batteryStatus = "Normal";
      break;
    case 0x01:
      decoded.batteryStatus = "Low power";
      break;
    default:
      decoded.batteryStatus = "Reserved for future use";
  }

  var antiDismantleStatus = (statusByte & 0x08) >> 3;
  decoded.antiDismantleStatus =
    antiDismantleStatus === 0x00 ? "Normal" : "Dismantled";

  var buttonStatus = statusByte & 0x07;
  switch (buttonStatus) {
    case 0x00:
      decoded.buttonStatus = "Normal";
      break;
    case 0x01:
      decoded.buttonStatus = "On";
      break;
    case 0x02:
      decoded.buttonStatus = "Mute";
      break;
    default:
      decoded.buttonStatus = "Reserved for future use";
  }

  var sensorValue = (bytes[4] << 8) | bytes[5];
  decoded.sensorValue = sensorValue;

  return decoded;
}

//----------------------END----------------------

//-------------------AN303-----------------------
function DecoderAN303(bytes) {
  const decoded = {};

  decoded.sensorName = "AN303";
  // Device ID
  decoded.deviceId = 0x01;

  // Frame format
  decoded.frameFormat = bytes[1] === 0x00 ? "Heartbeat frame" : "Data frame";

  // Anti-dismantle
  decoded.antiDismantle = bytes[2] === 0x01 ? "Dismantled" : "Not dismantle";

  // Temperature status
  switch (bytes[3]) {
    case 0x00:
      decoded.temperatureStatus = "Normal";
      break;
    case 0x01:
      decoded.temperatureStatus = "High temperature threshold alarm";
      break;
    case 0x02:
      decoded.temperatureStatus = "Low temperature threshold alarm";
      break;
    default:
      decoded.temperatureStatus = "Unknown";
  }

  // Temperature value
  const temp = ((bytes[4] << 8) | bytes[5]) / 10;
  decoded.temperatureValue = `${temp} °C`;

  // Humidity status
  switch (bytes[6]) {
    case 0x00:
      decoded.humidityStatus = "Normal";
      break;
    case 0x01:
      decoded.humidityStatus = "High humidity";
      break;
    case 0x02:
      decoded.humidityStatus = "Low humidity";
      break;
    default:
      decoded.humidityStatus = "Unknown";
  }

  // Humidity value
  const humidity = ((bytes[7] << 8) | bytes[8]) / 10;
  decoded.humidityValue = `${humidity} %`;

  // Voltage value
  const voltage = ((bytes[9] << 8) | bytes[10]) / 100;
  decoded.voltageValue = `${voltage} V`;

  // Power status
  const powerStatus = (bytes[9] & 0xf000) >> 12;
  decoded.powerStatus = powerStatus === 0x00 ? "Normal" : "Low power";

  return decoded;
}
//-------------------END------------------

//----------------AN305A------------------
function DecoderAN305A(bytes, port) {
  var decoded = {};

  decoded.sensorName = "AN305A";
  // Sensor type
  decoded.sensorType = bytes[0] === 0x08 ? "Default" : "Unknown";

  // Frame type
  switch (bytes[1]) {
    case 0x03:
      decoded.frameType = "Type A";
      break;
    case 0x01:
      decoded.frameType = "Type B";
      break;
    case 0x02:
      decoded.frameType = "Type C";
      break;
    default:
      decoded.frameType = "Unknown";
  }

  // Tamper status
  decoded.tamperStatus = bytes[2] === 0x01 ? "Tampered" : "Not Tampered";

  // Door contact status
  decoded.doorContactStatus = bytes[3] === 0x01 ? "Abnormal" : "Normal";

  // Battery level
  decoded.batteryLevel = (bytes[4] / 10).toFixed(1);

  return decoded;
}
//----------------------END-------------------------

//------------------Decoder for AN301
function DecoderAN301(bytes, port) {
  var decoded = {};
  decoded.sensorName = "AN301";
  decoded.frameType = bytes[1] === 0x00 ? "Heartbeat" : "Data";
  decoded.alarmState =
    bytes[2] === 0x00
      ? "Without Alarm"
      : bytes[2] === 0x01
      ? "With Alarm"
      : "Delay Reporting of Alarm";
  decoded.dismantleState = bytes[3] === 0x00 ? "Not Dismantled" : "Dismantled";
  decoded.voltage = (bytes[4] / 10).toFixed(1);
  decoded.default = 0x01;

  return decoded;
}
//-----------------------END------------------------
*/

async function updateClients_Soket(data, Sensor) {
  console.log("SocketClients", SocketClients);
  SocketClients.forEach((item) => {
    state = io
      .of("/Sensor/UpdateValue")
      .to(item.socketId)
      .emit("setChartdata", {
        SensId: Sensor._id,
        newData: data,
      });
  });
}

module.exports = router;
