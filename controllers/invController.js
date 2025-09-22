const invModel = require("../models/inventory-model");
const utilities = require("../utilities/");

const invCont = {}; // Initialize an empty object to hold controller methods

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId; // Get classification ID from the URL(from inventoryRoute.js)
  const data = await invModel.getInventoryByClassificationId(classification_id); // Fetch inventory data based on classification ID
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
  console.table(data); // Log the data for debugging
  const detail = await utilities.buildDetailViewHtml(data); // Build the inventory detail HTML
  let nav = await utilities.getNav(); // Get navigation HTML
  const vehicleName = data[0].inv_make; // Get vehicle name for the title
  res.render("./inventory/detail", {
    title: vehicleName,
    nav,
    detail,
  });
};

module.exports = invCont; // Export the controller object to be used in routes
