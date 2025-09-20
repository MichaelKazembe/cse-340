// Needed Resources
const express = require("express");
const router = new express.Router();
const invController = require("../controllers/invController");

// Route to build inventory by classification
router.get("/type/:classification_id", invController.buildByClassification);

module.exports = router;
