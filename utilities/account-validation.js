const accountModel = require("../models/account-model");
const utilities = require("../utilities/index");
const { body, validationResult } = require("express-validator");
const validate = {};

/* ************************
 *  Registration Data Validation Rules
 * ************************ */

validate.registrationRules = () => {
  return [
    // First name is required and must be string
    body("account_firstname")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 1 })
      .withMessage("First name is required."),

    // Last name is required and must be string
    body("account_lastname")
      .trim()
      .escape()
      .isLength({ min: 2 })
      .withMessage("Last name is required."),

    // Valid email is required and cannot already exist in database
    body("account_email")
      .trim()
      .escape()
      .notEmpty()
      .isEmail()
      .normalizeEmail() // Normalizes the email address (e.g., removes dots in Gmail addresses)
      .withMessage("A valid email is required.")
      .custom(async (account_email) => {
        const emailExists = await accountModel.checkExistingEmail(
          account_email
        );
        if (emailExists) {
          throw new Error(
            "Email exists. Please log in or use a different email."
          );
        }
      }),

    // password is required and must be strong
    body("account_password")
      .trim()
      .notEmpty()
      .isStrongPassword({
        minLength: 12,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      })
      .withMessage("Password does not meet requirements."),
  ];
};

/* ************************
 *  Check Registration Data and Return Errors
 * ************************ */

validate.checkRegData = async (req, res, next) => {
  const { account_firstname, account_lastname, account_email } = req.body;
  let errors = [];
  errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    res.render("account/register", {
      errors,
      title: "Registration",
      nav,
      account_firstname,
      account_lastname,
      account_email,
    });
    return;
  }
  next();
};

/* ************************
 *  Login Data Validation Rules
 * ************************ */

validate.loginRules = () => {
  return [
    // Valid email is required
    body("account_email")
      .trim()
      .escape()
      .notEmpty()
      .isEmail()
      .normalizeEmail()
      .withMessage("A valid email is required."),

    // password is required
    body("account_password").notEmpty().withMessage("Password is required."),
  ];
};

/* ************************
 *  Check Login Data and Return Errors
 * ************************ */

validate.checkLoginData = async (req, res, next) => {
  const { account_email } = req.body;
  let errors = [];
  errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    res.render("account/login", {
      errors,
      title: "Login",
      nav,
      account_email,
    });
    return;
  }
  next();
};

/* ************************
 *  Update Account Data Validation Rules
 * ************************ */
validate.checkAccountUpdateRules = () => {
  return [
    // First name is required and must be string
    body("account_firstname")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 1 })
      .withMessage("First name is required."),

    // Last name is required and must be string
    body("account_lastname")
      .trim()
      .escape()
      .isLength({ min: 2 })
      .withMessage("Last name is required."),

    // Valid email is required and cannot already exist in database
    body("account_email")
      .trim()
      .escape()
      .notEmpty()
      .isEmail()
      .normalizeEmail() // Normalizes the email address (e.g., removes dots in Gmail addresses)
      .withMessage("A valid email is required.")
      .custom(async (account_email, { req }) => {
        const account_id = parseInt(req.params.account_id);
        const emailExists = await accountModel.checkExistingEmail(
          account_email
        );
        if (emailExists) {
          const accountData = await accountModel.getAccountById(account_id);
          if (accountData.account_email !== account_email) {
            throw new Error("Email exists. Please use a different email.");
          }
        }
      }),
  ];
};

/* ************************
 *  Check Update Account Data and Return Errors
 * ************************ */

validate.checkUpdateAccountData = async (req, res, next) => {
  const { account_firstname, account_lastname, account_email } = req.body;
  let errors = [];
  errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    const account_id = parseInt(req.params.account_id);
    res.render("account/acc-update", {
      errors,
      title: "Account Update",
      nav,
      account_firstname,
      account_lastname,
      account_email,
      account_id: req.body.account_id,
    });
    return;
  }
  next();
};

/* ************************
 *  Change Password Data Validation Rules
 * ************************ */

validate.checkChangePasswordRules = () => {
  return [
    // Current password is required
    body("current_password")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Current password is required."),

    // New password is required
    body("new_password")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("New password is required.")
      .isStrongPassword({
        minLength: 12,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      })
      .withMessage("New password must be at least 12 characters long.")
      .custom((value, { req }) => {
        if (value !== req.body.confirm_password) {
          throw new Error("Passwords do not match.");
        }
        return true;
      }),
  ];
};

/* ************************
 *  Check Change Password Data and Return Errors
 * ************************ */

validate.checkChangePasswordData = async (req, res, next) => {
  const { account_firstname, account_lastname, account_email } = req.body;
  let errors = [];
  errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    res.render("account/acc-update", {
      errors,
      title: "Account Update",
      nav,
      account_firstname,
      account_lastname,
      account_email,
      account_id: req.body.account_id,
    });
    return;
  }
  next();
};

module.exports = validate; // Export the validation functions to be used in accountRoute.js
