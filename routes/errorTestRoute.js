const express = require("express");
const router = new express.Router();
const errorTestController = require("../controllers/errorTestController");

router.get("/trigger-error", errorTestController.triggerError); // Route to trigger an error

module.exports = router;
