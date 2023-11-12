const express = require("express");
const app = express();
require("dotenv/config");
var server = app.listen(3007);
var io = require("socket.io").listen(server);
let cron = require("node-cron");

const mongoose = require("mongoose");
const bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ limit: "500mb" }));
app.use(bodyParser.json({ limit: "500mb" }));
//var socket = io('http://localhost', {transports: ['websocket', 'polling', 'flashsocket']});
const cors = require("cors");
app.use(cors());

app.use(cors({ credentials: true, origin: "http://localhost:4200" }));
app.options("*", cors());
global.io = io;

const chatA = io.of("/Sensor/sm").on("connection", (socket) => {
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

    safeJoin(docId);
    socket.emit("documents", "serviceTest");
  });
});
const Sensor = require("./models/Sensor");
const userRoutes = require("./routes/UserRoute");
const downLink = require("./routes/Downlink");
const sensorRoutes = require("./routes/SensorRoute");
const factoryRoutes = require("./routes/FactoryRoute");
const zoneRoutes = require("./routes/ZoneRoute");
const reclamationRoutes = require("./routes/ReclamationRoute");
const alertRoutes = require("./routes/AlertRoute");
const profileRoutes = require("./routes/ProfileRoute");

app.use("/api/users", userRoutes);
app.use("/api/alerts", alertRoutes);
app.use("/api/sensors", sensorRoutes);
app.use("/api/factories", factoryRoutes);
app.use("/api/Reclamations", reclamationRoutes);
app.use("/api/users", profileRoutes);
app.use("/api/DownLink", downLink);
app.use("/api/zone", zoneRoutes);

app.post("/", (req, res) => {
  res.send("we are home");
});

cron.schedule("* * * * *", () => {
  console.log("running a task every minute");
});

var socketId;

app.post("/getSocketId", async (req, res) => {
  try {
    res.json(socketId);
  } catch (err) {
    res.json({ message: err.message });
  }
});

app.post("/smok", async (req, res) => {
  try {
    var tm = new Date(Date.now()).getTime();
    tram = {
      "ON/Of": 0,
      type: "Sensor",
      state: "",
      time: tm,

      batteryLevel: 2.7,
    };

    device = await Sensor.findOne({ code: "5555555555555555" });

    device.data.push(tram);
    await device.save();
    console.log("SocketId!!:" + socketId);
    io.of("/Sensor/sm").to(socketId).emit("SetSmoke", "102");

    res.json(device);
  } catch (err) {
    res.json({ message: err.message });
  }
});

mongoose.connect(
  "mongodb://127.0.0.1:27017/usina",
  {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  (error) => {
    if (error) {
      console.error("Failed to connect to the database:", error);
    } else {
      console.log("Connected to the database");
    }
  }
);

console.log("socketIdLastttt: " + socketId);
module.export = io;
