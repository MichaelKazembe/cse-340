// Needed Resources
const express = require("express");
const router = new express.Router();
const checkAccountType = require("../utilities/index").checkAccountType;
const invController = require("../controllers/invController");
const validate = require("../utilities/inventory-validation");

// Route to build inventory by classification
router.get("/type/:classificationId", invController.buildByClassificationId);

// Route to build inventory detail view
router.get("/detail/:invId", invController.buildDetailView);

// Route to build management view
router.get("/management", checkAccountType, invController.buildManagementView);

// Route to build new classification Name
router.get(
  "/add-classification",
  checkAccountType,
  invController.buildAddClassificationView
);

// Route to create new classification Name
router.post(
  "/add-classification",
  checkAccountType,
  validate.classificationRules(),
  validate.checkClassificationData,
  invController.handleAddClassification
);

// Route to build new inventory view
router.get(
  "/add-inventory",
  checkAccountType,
  invController.buildAddInventoryView
);

// Route to create a new inventory
router.post(
  "/add-inventory",
  checkAccountType,
  validate.inventoryRules(),
  validate.checkInventoryData,
  invController.handleAddInventory
);

// Route to get inventory by classificationId and return as JSON
router.get("/getInventory/:classification_id", checkAccountType, invController.getInventoryJSON);

// Route to build edit inventory view
router.get(
  "/edit/:inv_id",
  checkAccountType,
  invController.buildEditInventoryView
);

// Route to update inventory
router.post(
  "/update/",
  checkAccountType,
  validate.checkUpdateData,
  invController.updateInventory
);

// Route to build delete inventory view
router.get("/delete/:inv_id", checkAccountType, invController.buildDeleteInventoryView);

// Route to delete inventory
router.post("/delete/", checkAccountType, invController.deleteInventory);

// Route to add a review
router.post("/detail/:inv_id/review", validate.reviewRules(), validate.checkReviewData, invController.handleAddReview);

module.exports = router; // Export the router to be used in server.js
