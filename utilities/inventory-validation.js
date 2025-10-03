const utilities = require(".");
const { body, validationResult } = require("express-validator");
const invModel = require("../models/inventory-model");

const validate = {};

/*  **********************************
 *  Classification Name Validation Rules
 * ********************************* */
validate.classificationRules = () => {
  return [
    // classification_name is required and must be string
    body("classification_name")
      .trim()
      .isLength({ min: 3, max: 20 })
      .withMessage("Classification name must be between 3 and 20 characters.")
      .matches(/^[A-Za-z0-9]+$/)
      .withMessage(
        "Classification name cannot contain spaces or special characters."
      )
      .custom(async (classification_name) => {
        try {
          const existingClassification = await invModel.getClassificationByName(
            classification_name
          );
          if (existingClassification.rows.length > 0) {
            throw new Error(
              "Classification name already exists. Please use a different name."
            );
          }
        } catch (error) {
          if (
            error.message ===
            "Classification name already exists. Please use a different name."
          ) {
            throw error;
          }
          // If there's a database error but no existing classification found, continue
        }
      }),
  ];
};

/* ******************************
 * Check data and return errors or continue to controller
 * ***************************** */
validate.checkClassificationData = async (req, res, next) => {
  const { classification_name } = req.body;
  let errors = [];
  errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    res.render("inventory/add-classification", {
      errors,
      title: "New Classification",
      nav,
      classification_name,
    });
    return;
  }
  next();
};

module.exports = validate;
