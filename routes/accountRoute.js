// Needed Resources
const validation = require("../utilities/account-validation");
const utilities = require("../utilities/");
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
  validation.registrationRules(), // validation rules to check form data
  validation.checkRegData, // check the form data for errors
  accountController.registerAccount // if no errors, register the account
);

// Process the login attempt
router.post(
  "/login",
  validation.loginRules(),
  validation.checkLoginData,
  accountController.accountLogin
);

// Route to account management view
router.get("/", utilities.checkLogin, accountController.buildAccountManagement);

// Route to build account information
router.get(
  "/update/:account_id",
  accountController.buildAccountUpdate
);

// Route to process account update account information
router.post(
  "/update/:account_id",
  validation.checkAccountUpdateRules(),
  validation.checkUpdateAccountData,
  accountController.processAccountUpdate
);

// Route to process account password changes
router.post(
  "/change-password",
  validation.checkChangePasswordRules(),
  validation.checkChangePasswordData,
  accountController.processChangePassword
);

// 

module.exports = router; // Export the router to be used in server.js
