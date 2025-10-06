// Needed Resources
const regValidate = require("../utilities/account-validation");
const express = require("express");
const router = new express.Router();
const accountController = require("../controllers/accountController");

// Route to build the login view
router.get("/login", accountController.buildLogin);

// Route to build the registration view
router.get("/register", accountController.buildRegister);

// Router to register a new account
router.post(
  "/register",
  regValidate.registrationRules(), // validation rules to check form data
  regValidate.checkRegData, // check the form data for errors
  accountController.registerAccount // if no errors, register the account
);

// Process the login attempt
router.post(
  "/login",
  regValidate.loginRules(),
  regValidate.checkLoginData,
  // (req, res) => {
  //   res.status(200).send("login process");
  // },
  accountController.accountLogin
);
// Route to account management view
router.get("/", utilities.checkLogin, accountController.buildAccountManagement);

module.exports = router; // Export the router to be used in server.js
