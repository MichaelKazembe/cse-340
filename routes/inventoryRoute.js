// Needed Resources
const express = require("express");
const router = new express.Router();
const invController = require("../controllers/invController");

// Route to build inventory by classification
router.get("/type/:classificationId", invController.buildByClassificationId);

// Route to build inventory detail view
router.get("/detail/:invId", invController.buildDetailView);

// Route to build management view
router.get("/management", invController.buildManagementView);

// Route to build new classification Name
// router.get("/management/classification", invController.buildNewClassification);

// Route to create new classification Name
// router.post("/management/classification/:classificationName", invController.buildNewClassification);

// Route to build new inventory view
// router.get("/management/inventory/:inventoryId", invController.buildNewInventory);

module.exports = router; // Export the router to be used in server.js
