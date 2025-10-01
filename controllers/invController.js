const invModel = require("../models/inventory-model");
const utilities = require("../utilities/");

const invCont = {}; // Initialize an empty object to hold controller methods

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId; // Get classification ID from the URL(from inventoryRoute.js)
  const data = await invModel.getInventoryByClassificationId(classification_id); // Fetch inventory data based on classification ID
  // If there is no data or empty data, return 404
  if (!data || data.length === 0) {
    const err = new Error("No vehicles found");
    err.status = 404;
    return next(err);
  }
  const grid = await utilities.buildClassificationGrid(data); // Build the inventory grid
  let nav = await utilities.getNav();
  const className = data[0].classification_name; // Get classification name for the title
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  });
};

/* ***************************
 *  Build inventory detail view
 * ************************** */
invCont.buildDetailView = async function (req, res, next) {
  const inv_id = req.params.invId; // Get inventory ID from the URL
  const data = await invModel.getInventoryById(inv_id); // Fetch inventory data based on inventory ID
  // If there is no data or empty data, return 404
  if (!data || data.length === 0) {
    const err = new Error("Vehicle not found");
    err.status = 404;
    return next(err);
  }
  const detail = await utilities.buildDetailViewHtml(data); // Build the inventory detail HTML
  let nav = await utilities.getNav(); // Get navigation HTML
  const vehicleName = data[0].inv_make; // Get vehicle name for the title
  res.render("./inventory/detail", {
    title: vehicleName,
    nav,
    detail,
  });
};

/* ***************************
 *  Build Management view
 * ************************** */
invCont.buildManagementView = async function (req, res, next) {
  const nav = await utilities.getNav();
  res.render("./inventory/management", {
    title: "Inventory Management",
    nav,
  });
};

/* ***************************
 *  Build add classification view
 * ************************** */
invCont.buildAddClassificationView = async function (req, res, next) {
  const nav = await utilities.getNav();
  res.render("./inventory/add-classification", {
    title: "New Classification",
    nav,     
  });
};

/* ***************************
 *  Build add inventory view
 * ************************** */
invCont.buildAddInventoryView = async function (req, res, next) {
  const nav = await utilities.getNav();
  res.render("./inventory/add-inventory", {
    title: "Add New Inventory",
    nav,
  });
};

/* ***************************
 *  Handle add classification
 * ************************** */
// invCont.buildAddClassification = async function (req, res, next) {
//   const { classificationName } = req.body;
//   const addResult = await invModel.addClassification(classificationName);
//   if (addResult) {
//     req.flash("success", `The classification ${classificationName} was added successfully.`);
//     res.redirect("/inv/management");
//   } else {
//     req.flash("error", `Sorry, the classification ${classificationName} could not be added.`);
//     res.redirect("/inv/management");
//   }
// };

module.exports = invCont; // Export the controller object to be used in routes
