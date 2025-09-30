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
      .withMessage("A valid email is required."),

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

module.exports = validate;
