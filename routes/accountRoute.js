// Needed Resources
const express = require("express");
const router = new express.Router();
const accountController = require("../controllers/accountController");

// Route to build the login view
router.get("/login", accountController.buildLogin);

// Route to build the registration view
router.get("/register", accountController.buildRegister);

// Router to register a new account
router.post("/register", accountController.registerAccount);

module.exports = router;
