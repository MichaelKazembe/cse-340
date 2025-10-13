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
  const classificationList = await utilities.buildClassificationList();
  res.render("./inventory/management", {
    title: "Inventory Management",
    nav,
    classificationList,
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
 *  Handle add classification
 * ************************** */
invCont.handleAddClassification = async function (req, res, next) {
  const { classification_name } = req.body;

  try {
    const addResult = await invModel.createNewClassification(
      classification_name
    );
    if (addResult) {
      req.flash(
        "success",
        `The classification "${classification_name}" was added successfully.`
      );
      // Create new navigation to show the new classification immediately
      const nav = await utilities.getNav();
      res.render("./inventory/management", {
        title: "Inventory Management",
        nav,
      });
    } else {
      req.flash(
        "error",
        `Sorry, the classification "${classification_name}" could not be added.`
      );
      const nav = await utilities.getNav();
      res.render("./inventory/add-classification", {
        title: "New Classification",
        nav,
        classification_name,
      });
    }
  } catch (error) {
    req.flash(
      "error",
      `Sorry, there was an error adding the classification "${classification_name}".`
    );
    const nav = await utilities.getNav();
    res.render("./inventory/add-classification", {
      title: "New Classification",
      nav,
      classification_name,
    });
  }
};

/* ***************************
 *  Build Add New Inventory View
 * ************************** */
invCont.buildAddInventoryView = async function (req, res, next) {
  const nav = await utilities.getNav();
  const classificationList = await utilities.buildClassificationList();
  res.render("./inventory/add-inventory", {
    title: "Add New Inventory",
    nav,
    classificationList,
  });
};

/* ***************************
 *  Handle add Inventory
 * ************************** */
invCont.handleAddInventory = async function (req, res, next) {
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

  try {
    const addResult = await invModel.createNewInventoryItem(req.body);
    if (addResult) {
      req.flash(
        "success",
        `The inventory item "${inv_make} ${inv_model}" was added successfully.`
      );
      // Create new navigation to show the new vehicle immediately
      const nav = await utilities.getNav();
      res.render("./inventory/management", {
        title: "Inventory Management",
        nav,
      });
    } else {
      req.flash(
        "error",
        `Sorry, the inventory item "${inv_make} ${inv_model}" could not be added.`
      );
      const nav = await utilities.getNav();
      const classificationList = await utilities.buildClassificationList();
      res.render("./inventory/add-inventory", {
        title: "Add New Inventory",
        nav,
        classificationList,
      });
    }
  } catch (error) {
    req.flash(
      "error",
      `Sorry, there was an error adding the inventory item "${inv_make} ${inv_model}".`
    );
    const nav = await utilities.getNav();
    const classificationList = await utilities.buildClassificationList();
    res.render("./inventory/add-inventory", {
      title: "Add New Inventory",
      nav,
      classificationList,
    });
  }
};

/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */

invCont.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id);
  const invData = await invModel.getInventoryByClassificationId(
    classification_id
  );
  if (invData && invData.length > 0 && invData[0].inv_id) {
    return res.json(invData);
  } else {
    next(new Error("No data returned"));
  }
};

/* ***************************
 *  Build edit inventory view
 * ************************** */

invCont.buildEditInventoryView = async function (req, res, next) {
  const inv_id = parseInt(req.params.inv_id);
  let nav = await utilities.getNav();
  const itemData = await invModel.getInventoryById(inv_id);
  const invData = itemData[0];
  const classificationList = await utilities.buildClassificationList(
    invData.classification_id
  );
  const itemName = `${invData.inv_make} ${invData.inv_model}`;
  res.render("./inventory/edit-inventory", {
    title: "Edit " + itemName,
    nav,
    classificationList: classificationList,
    errors: null,
    inv_id: invData.inv_id,
    inv_make: invData.inv_make,
    inv_model: invData.inv_model,
    inv_year: invData.inv_year,
    inv_description: invData.inv_description,
    inv_image: invData.inv_image,
    inv_thumbnail: invData.inv_thumbnail,
    inv_price: invData.inv_price,
    inv_miles: invData.inv_miles,
    inv_color: invData.inv_color,
    classification_id: invData.classification_id,
  });
};

/* ***************************
 *  Handle update Inventory Data
 * ************************** */
// invCont.updateInventory = async function (req, res, next) {
//   let nav = await utilities.getNav();
//   const {
//     inv_id,
//     inv_make,
//     inv_model,
//     inv_year,
//     inv_description,
//     inv_image,
//     inv_thumbnail,
//     inv_price,
//     inv_miles,
//     inv_color,
//     classification_id,
//   } = req.body;
//   const updateResult = await invModel.updateInventory(
//     inv_id,
//     inv_make,
//     inv_model,
//     inv_year,
//     inv_description,
//     inv_image,
//     inv_thumbnail,
//     inv_price,
//     inv_miles,
//     inv_color,
//     classification_id
//   );
//   if (updateResult) {
//     const itemName = updateResult.inv_make + " " + updateResult.inv_model;
//     req.flash(
//       "success",
//       `The inventory item "${itemName}" was updated successfully.`
//     );
//     res.redirect("/inv/management");
//   } else {
//     const classificationList = await utilities.buildClassificationList(
//       classification_id
//     );
//     const itemName = `${inv_make} ${inv_model}`;
//     req.flash("error", "Sorry, the insert failed.");
//     res.status(501).render("./inventory/edit-inventory", {
//       title: "Edit " + itemName,
//       nav,
//       classificationList: classificationList,
//       errors: null,
//       inv_id,
//       inv_make,
//       inv_model,
//       inv_year,
//       inv_description,
//       inv_image,
//       inv_thumbnail,
//       inv_price,
//       inv_miles,
//       inv_color,
//       classification_id,
//     });
//   }
// };

invCont.updateInventory = async (req, res, next) => {
  try {
    let nav = await utilities.getNav();
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
    const updateResult = await invModel.updateInventory(
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
      classification_id
    );

    if (updateResult) {
      const itemName = updateResult.inv_make + " " + updateResult.inv_model;
      req.flash("notice", `The ${itemName} was successfully updated.`);
      res.redirect("/inv/management");
    } else {
      const classificationSelect = await utilities.buildClassificationList(
        classification_id
      );
      const itemName = `${inv_make} ${inv_model}`;
      req.flash("notice", "Sorry, the insert failed.");
      res.status(501).render("inventory/edit-inventory", {
        title: "Edit " + itemName,
        nav,
        classificationSelect: classificationSelect,
        errors: null,
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
    }
  } catch (error) {
    console.error("Error adding inventory item: ", error);
    req.flash(
      "messages",
      "Error adding inventory item. Please try again later."
    );
    res.redirect("/inv/add-inventory");
  }
};

module.exports = invCont; // Export the controller object to be used in routes
