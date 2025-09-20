const invModel = require("../models/inventory-model");
const utilities = require("../utilities/");

const invCont = {}; // Initialize an empty object to hold controller methods

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId; // Get classification ID from the URL(from inventoryRoute.js)
  const data = await invModel.getInventoryByClassificationId(classification_id);
  const grid = await utilities.buildClassificationGrid(data); // Build the inventory grid
  let nav = await utilities.getNav();
  const className = data[0].classification_name; // Get classification name for the title
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  });
};

module.exports = invCont; // Export the controller object to be used in routes
