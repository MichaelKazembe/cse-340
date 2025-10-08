// Needed Resources
const express = require("express");
const router = new express.Router();
const invController = require("../controllers/invController");
const validate = require("../utilities/inventory-validation");

// Route to build inventory by classification
router.get("/type/:classificationId", invController.buildByClassificationId);

// Route to build inventory detail view
router.get("/detail/:invId", invController.buildDetailView);

// Route to build management view
router.get("/management", invController.buildManagementView);

// Route to build new classification Name
router.get("/add-classification", invController.buildAddClassificationView);

// Route to create new classification Name
router.post(
  "/add-classification",
  validate.classificationRules(),
  validate.checkClassificationData,
  invController.handleAddClassification
);

// Route to build new inventory view
router.get("/add-inventory", invController.buildAddInventoryView);

// Route to create a new inventory
router.post(
  "/add-inventory",
  validate.inventoryRules(),
  validate.checkInventoryData,
  invController.handleAddInventory
);

// Route to get inventory by classificationId and return as JSON
router.get("/getInventory/:classificationId", invController.getInventoryJSON);

module.exports = router; // Export the router to be used in server.js
