// Needed Resources
const express = require("express");
const router = new express.Router();
const accountController = require("../controllers/accountController");
const utilities = require("../utilities/");

// Route to build the registration view
router.get(
  "/login",
  accountController.buildLogin
);

module.exports = router;
