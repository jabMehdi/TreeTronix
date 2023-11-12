const mongoose = require("mongoose");
const Sensor = require("./Sensor"); // Import your Mongoose model

// Connect to your MongoDB database
mongoose.connect("mongodb://127.0.0.1:27017/usina", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on("error", (err) => {
  console.error("MongoDB connection error:", err);
});

db.once("open", async () => {
  // Update the model field for all documents
  try {
    const result = await Sensor.updateMany({}, { $set: { model: {} } });
    console.log("Updated documents:", result.nModified);
  } catch (err) {
    console.error("Error updating documents:", err);
  } finally {
    // Close the database connection
    mongoose.connection.close();
  }
});
