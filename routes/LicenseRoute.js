// routes/licenseRoutes.js
const cron = require("node-cron");
const express = require("express");
const router = express.Router();
const License = require("../models/Licence");
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
// Create a new license
router.post("/create", async (req, res) => {
  try {
    const { userid, activationKey, factoryId, endDate /*, other fields */ } =
      req.body;
    const newLicense = new License({
      userid,
      activationKey,
      factoryId,
      endDate /*, other fields */,
    });

    await newLicense.save();

    res
      .status(201)
      .json({ status: "success", message: "License created successfully" });
  } catch (error) {
    console.error("Error creating license:", error);
    res.status(500).json({ status: "error", message: "Internal server error" });
  }
});

// Get all licenses
router.post("/all", verifyToken, async (req, res) => {
  try {
    const licenses = await License.find({ userid: req.id });
    res.json(licenses);
  } catch (error) {
    console.error("Error fetching licenses:", error);
    res.json({ message: err.message });
  }
});

// Get a specific license by ID
router.get("/:licenseId", verifyToken, async (req, res) => {
  try {
    const license = await License.findById(req.params.licenseId);
    if (!license) {
      return res
        .status(404)
        .json({ status: "error", message: "License not found" });
    }
    res.status(200).json({ status: "success", license });
  } catch (error) {
    console.error("Error fetching license:", error);
    res.status(500).json({ status: "error", message: "Internal server error" });
  }
});

// Update a license by ID
router.put("/:licenseId", verifyToken, async (req, res) => {
  try {
    const { factoryId, endDate /*, other fields */ } = req.body;
    const updatedLicense = await License.findByIdAndUpdate(
      req.params.licenseId,
      { factoryId, endDate /*, other fields */ },
      { new: true }
    );
    if (!updatedLicense) {
      return res
        .status(404)
        .json({ status: "error", message: "License not found" });
    }
    res.status(200).json({
      status: "success",
      message: "License updated successfully",
      license: updatedLicense,
    });
  } catch (error) {
    console.error("Error updating license:", error);
    res.status(500).json({ status: "error", message: "Internal server error" });
  }
});

// Delete a license by ID
router.delete("/del/:licenseId", (req, res) => {
  console.log(req.body); // You can log the request body if needed

  License.findByIdAndDelete(req.params.licenseId)
    .then((deletedLicense) => {
      if (!deletedLicense) {
        return res
          .status(404)
          .json({ status: "error", message: "License not found" });
      }

      res
        .status(200)
        .json({ status: "success", message: "License deleted successfully" });
    })
    .catch((error) => {
      console.error("Error deleting license:", error);
      res
        .status(500)
        .json({ status: "error", message: "Internal server error" });
    });
});

// Activate a license using a key
router.post("/activate", async (req, res) => {
  try {
    const { activationKey } = req.body;

    // Find the license with the provided activation key
    const existingLicense = await License.findOne({ activationKey });

    if (!existingLicense) {
      // Key not found, set status to "In progress"
      return res.status(404).json({
        status: "error",
        message: "Invalid activation key",
        licenseStatus: "In progress",
      });
    }

    // Key found, set status to "Active"
    existingLicense.status = "Active";
    await existingLicense.save(); // Make sure existingLicense is not null before this line

    res.status(200).json({
      status: "success",
      message: "License activated successfully",
      licenseStatus: "Active",
    });
  } catch (error) {
    console.error("Error activating license:", error);
    res.status(500).json({ status: "error", message: "Internal server error" });
  }
});
cron.schedule("0 0 * * *", async () => {
  try {
    // Find licenses with an end date less than or equal to the current date
    const expiredLicenses = await License.find({
      endDate: { $lte: new Date() }, // Find licenses that have expired
    });

    // Update the status to "Expired" for each expired license
    await Promise.all(
      expiredLicenses.map(async (license) => {
        license.status = "Expired";
        await license.save();
      })
    );

    console.log("Updated status for expired licenses");
  } catch (error) {
    console.error("Error updating license status:", error);
  }
});

module.exports = router;
