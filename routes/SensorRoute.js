const express = require("express");
const router = express.Router();
const Sensor = require("../models/Sensor");
const Factory = require("../models/Factory");
const Alert = require("../models/Alert");
const GlobalSensor = require("../models/GlobalSensor");
var jwt = require("jsonwebtoken");
const F = require("../models/Factory");
var nodemailer = require("nodemailer");

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
      }
      if (
        device.type === "mono" ||
        device.type === "triphase" ||
        device.type === "WaterMeter"
      ) {
        compteurCrypt(obj.DevEUI_uplink.payload_hex, obj.DevEUI_uplink.DevEUI);
      }
      if (device.type == "smoke") {
        CryptSmoke(
          obj.DevEUI_uplink.payload_hex,
          obj.DevEUI_uplink.DevEUI,
          obj.DevEUI_uplink.Time
        );
      }
      if (device.type === "AN-103A") {
        CryptXTreeEXTER(
          obj.DevEUI_uplink.payload_hex,
          obj.DevEUI_uplink.DevEUI,
          obj.DevEUI_uplink.Time
        );
      }
      if (device.type === "AN-303") {
        CryptAN303(
          obj.DevEUI_uplink.payload_hex,
          obj.DevEUI_uplink.DevEUI,
          obj.DevEUI_uplink.Time
        );
      }
      if (device.type === "AN-301") {
        CryptSOSalarm(
          obj.DevEUI_uplink.payload_hex,
          obj.DevEUI_uplink.DevEUI,
          obj.DevEUI_uplink.Time
        );
      }

      if (device.type === "AN-304C") {
        CryptMotion(
          obj.DevEUI_uplink.payload_hex,
          obj.DevEUI_uplink.DevEUI,
          obj.DevEUI_uplink.Time
        );
      }
      if (device.type === "AN-305A") {
        CryptWindowDoorContact(
          obj.DevEUI_uplink.payload_hex,
          obj.DevEUI_uplink.DevEUI,
          obj.DevEUI_uplink.Time
        );
      }
      if (device.type === "AN-302") {
        //io.of('/Sensor/sm').emit('AN-302', JSON.stringify(cryptHassine(obj.DevEUI_uplink.payload_hex, obj.DevEUI_uplink.DevEUI, obj.DevEUI_uplink.Time)));
        CryptGAZ(
          obj.DevEUI_uplink.payload_hex,
          obj.DevEUI_uplink.DevEUI,
          obj.DevEUI_uplink.Time
        );
      }
      if (device.type === "LT-22222-L") {
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
  //Status= (parseInt(data.substring(6, 8), 16));
  //SensorValue = (parseInt(data.substring(8, 12), 16));
  satutsBButon = Status.substring(0, 3);
  satutsDismantle = Status.substring(3, 4);
  satutsBatterie = Status.substring(5, 7);
  satutsSensor = Status.substring(7, 9);
  tm = Date.parse(time);
  //  console.log("Smoke State: " + state);
  //  console.log("Smoke battery: " + batterylevel)
  var tram = {
    "Device ID": +DeviceID,
    SensorType: +SensorType,
    FrameFormat: +FrameFormat,
    //"Status":+Status,

    SensorValue: +satutsSensor,
    time: +tm,
    type: "AN-302",
  };

  device = await Sensor.findOne({ code: DevEUI });
  device.data.push(tram);
  await device.save();
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
  tm = Date.parse(time);
  
  var tram = {
    SensorType: +SensorType,
    FrameType: FrameType, ////////////////////////////
    SensorStatus: +SensorStatus,
    SwitchStatus: +SwitchStatus,
    BatteryVolatage: +BatteryVolatage,
    time: +tm,
    type: "AN-304C",
  };
  console.log("BatteryVolatage: " + BatteryVolatage);
  device = await Sensor.findOne({ code: DevEUI });
  device.data.push(tram);
  await device.save();
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
  tm = Date.parse(time);
  //  console.log("Smoke State: " + state);
  //  console.log("Smoke battery: " + batterylevel)
  var tram = {
    SensorType: +SensorType,
    FrameType: FrameType, ///////////////////////
    TamperStatus: +TamperStatus,
    DoorContactStatus: +DoorContactStatus,
    BatteryLevel: +BatteryLevel,
    time: +tm,
    type: "AN-305A",
  };
  console.log("BatteryLevel: " + BatteryLevel);
  device = await Sensor.findOne({ code: DevEUI });
  device.data.push(tram);
  await device.save();
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
  tm = Date.parse(time);
  //  console.log("Smoke State: " + state);
  //  console.log("Smoke battery: " + batterylevel)
  var tram = {
    SensorType: +SensorType,
    FrameType: FrameType,
    AlarmState: +AlarmState,
    StateDismantling: +StateDismantling,
    Voltage: +Voltage,
    time: +tm,
    type: "AN-301",
  };
  console.log("Voltage: " + Voltage);
  console.log("Voltage: " + AlarmState);
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

  device = await Sensor.findOne({ code: DevEUI });
  device.data.push(tram);
  await device.save();
  updateClients_Soket(tram, device);
}

async function CryptAN303(data, DevEUI, time) {
  
  DeviceID = parseInt(data.substring(0, 2), 16);
  Frameformat = parseInt(data.substring(2, 4), 16);
  Antidismantle = parseInt(data.substring(4, 6), 16);
  tempStatus = parseInt(data.substring(6, 8), 16);
  temp = parseInt(data.substring(8, 12), 16) / 10;
  humStatus = parseInt(data.substring(12, 14), 16);

  hum = parseInt(data.substring(14, 18), 16) / 10;

  voltage = parseInt(data.substring(18, 22), 16) / 100;

  tm = Date.parse(time);
  tram = {
    DeviceID: +DeviceID,
    Frameformat: +Frameformat,
    Antidismantle: Antidismantle,
    tempStatus: +tempStatus,
    tempValues: +temp,
    humStatus: +humStatus,
    humValues: +hum,
    voltage: +voltage,
    time: +tm,
    type: "AN-303",
  };
  console.log("temperature: " + temp);
  console.log("humidite: " + hum);
  console.log("TESTTTTTTTTTTTT AN303");

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

  device = await Sensor.findOne({ code: DevEUI });
  device.data.push(tram);
  await device.save();
  updateClients_Soket(tram, device);
}

async function CryptSmoke(data, DevEUI, time) {
  // console.log("trame: " + data);
  //  console.log("Sensor Id: " + DevEUI)
  //  console.log("time: " + time)
  var state = parseInt(data.substring(0, 2), 16);
  var batterylevel = parseInt(data.substring(2, 4), 16) / 10;
  var tm = Date.parse(time);
  //  console.log("Smoke State: " + state);
  console.log("Smoke battery: " + batterylevel);
  var tram = {
    state: +state,
    type: "smoke",

    time: +tm,

    batteryLevel: +batteryLevel,
  };
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

  tm = Date.parse(time);

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
    time: +tm,
    type: "AN-103A",
  };

  console.log("temperature: " + temp);
  console.log("humidite: " + hum);
  console.log("voltage: " + voltage);

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

  device = await Sensor.findOne({ code: DevEUI });
  device.data.push(tram);
  await device.save();
  updateClients_Soket(tram, device);
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

  tm = Date.parse(time);

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
    time: +tm,
    type: "AN-103A",
  };

  console.log("temperature: " + temp);
  console.log("humidite: " + hum);
  console.log("voltage: " + voltage);

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

  device = await Sensor.findOne({ code: DevEUI });
  device.data.push(tram);
  await device.save();
  updateClients_Soket(tram, device);
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
  tm = Date.parse(time);

  /* console.log("Time: " + tm)
     console.log('Temperature: ', temp);
     console.log('Humidity', hum);
     console.log('Battery level', batterie);*/
  tram = {
    energy: 6,
    type: "Sensor",
    state: "",
    time: +tm,
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

  device = await Sensor.findOne({ code: DevEUI });
  device.data.push(tram);
  await device.save();
  updateClients_Soket(tram, device);
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
      const s = await Sensor.find({userId: req.id });
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
