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

/*  **********************************
 *  Add Inventory Item Validation Rules
 * ********************************* */
validate.inventoryRules = () => {
  return [
    // inv_make is required and must be string
    body("inv_make")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Make is required.")
      .isLength({ max: 30 })
      .withMessage("Make cannot be longer than 30 characters."),
    // inv_model is required and must be string
    body("inv_model")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Model is required.")
      .isLength({ max: 30 })
      .withMessage("Model cannot be longer than 30 characters."),
    // inv_year is required and must be a valid year
    body("inv_year")
      .trim()
      .isInt({ min: 1886, max: new Date().getFullYear() + 1 })
      .withMessage(
        `Please provide a valid year between 1886 and ${
          new Date().getFullYear() + 1
        }.`
      ),
    // inv_description is required and must be string
    body("inv_description")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Description is required.")
      .isLength({ max: 500 })
      .withMessage("Description cannot be longer than 500 characters."),
    // inv_image is required and must be a valid path
    body("inv_image")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Image path is required.")
      .matches(
        /^\/images\/vehicles\/[a-zA-Z0-9._-]+\.((jpg)|(jpeg)|(png)|(gif))$/i
      )
      .withMessage("Image path must be in the form /images/vehicles/model.jpg"),
    // inv_thumbnail is required and must be a valid path
    body("inv_thumbnail")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Thumbnail path is required.")
      .matches(
        /^\/images\/vehicles\/[a-zA-Z0-9._-]+\.((jpg)|(jpeg)|(png)|(gif))$/i
      )
      .withMessage(
        "Thumbnail path must be in the form /images/vehicles/model-tn.jpg"
      ),
    // inv_price is required and must be a valid decimal
    body("inv_price")
      .trim()
      .isFloat({ min: 0 })
      .withMessage("Please provide a valid price greater than or equal to 0."),
    // inv_miles is required and must be a valid integer
    body("inv_miles")
      .trim()
      .isInt({ min: 0 })
      .withMessage("Please provide valid mileage greater than or equal to 0."),
    // inv_color is required and must be string
    body("inv_color")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Color is required.")
      .isLength({ max: 30 })
      .withMessage("Color cannot be longer than 30 characters."),
    // classification_id is required and must be a valid integer
    body("classification_id")
      .trim()
      .isInt({ min: 1 })
      .withMessage("Please select a valid classification."),
  ];
};

/* ******************************
 * Check Inventory data and return errors to Add Inventory view or continue to controller
 * ***************************** */
validate.checkInventoryData = async (req, res, next) => {
  const {
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id,
  } = req.body;

  let errors = [];
  errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    const classificationList = await utilities.buildClassificationList();
    res.render("inventory/add-inventory", {
      errors,
      title: "Add New Inventory",
      nav,
      classificationList,
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
      classification_id,
    });
    return;
  }
  next();
};

/* ******************************
 * Check Inventory data and return errors to Edit Viewer continue to controller
 * ***************************** */
validate.checkUpdateData = async (req, res, next) => {
  const {
    inv_id,
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id,
  } = req.body;

  let errors = [];
  errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    const classificationList = await utilities.buildClassificationList();
    res.render("inventory/edit-inventory", {
      title: "Edit Inventory",
      nav,
      errors,
      classificationList,
      inv_id,
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
      classification_id,
    });
    return;
  }
  next();
};

module.exports = validate;
