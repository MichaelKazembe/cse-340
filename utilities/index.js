const invModel = require("../models/inventory-model");
const Util = {}; // container for all utility functions

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications(); // get the array of classifications
  let list = "<ul class='navigation'>"; // start the list
  list += '<li><a href="/" title="Home Page">Home</a></li>';
  data.rows.forEach((row) => {
    // for each classification row
    list += "<li>"; // open a list item
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>";
    list += "</li>"; // close the list item
  });
  list += "</ul>"; // close the list
  return list;
};

/* **************************************
 * Build the classification view HTML
 * ************************************ */
Util.buildClassificationGrid = async function (data) {
  let grid;
  if (data.length > 0) {
    grid = '<ul id="inv-display">';
    data.forEach((vehicle) => {
      grid += "<li>";
      grid +=
        '<a href="../../inv/detail/' +
        vehicle.inv_id +
        '" title="View ' +
        vehicle.inv_make +
        " " +
        vehicle.inv_model +
        'details"><img src="' +
        vehicle.inv_thumbnail +
        '" alt="Image of ' +
        vehicle.inv_make +
        " " +
        vehicle.inv_model +
        ' on CSE Motors" /></a>';
      grid += '<div class="namePrice">';
      grid += "<hr />";
      grid += "<h2>";
      grid +=
        '<a href="../../inv/detail/' +
        vehicle.inv_id +
        '" title="View ' +
        vehicle.inv_make +
        " " +
        vehicle.inv_model +
        ' details">' +
        vehicle.inv_make +
        " " +
        vehicle.inv_model +
        "</a>";
      grid += "</h2>";
      grid +=
        "<span>$" +
        new Intl.NumberFormat("en-US").format(vehicle.inv_price) +
        "</span>";
      grid += "</div>";
      grid += "</li>";
    });
    grid += "</ul>";
  } else {
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>';
  }
  return grid;
};

/* **************************************
 * Build the inventory detail view HTML
 * ************************************ */
Util.buildDetailViewHtml = async function (data) {
  let detail;
  if (data.length > 0) {
    const vehicle = data[0];
    // Format the price and Milage
    const price = new Intl.NumberFormat("en-US").format(vehicle.inv_price);
    const milage = new Intl.NumberFormat("en-US").format(vehicle.inv_miles);

    detail = `<div class="detail-container">
                <div class="detail-image">
                  <img src="${vehicle.inv_image}" alt="Image of ${vehicle.inv_make} ${vehicle.inv_model} on CSE Motors" />
                </div>
                <div class="detail-info">
                  <h2>${vehicle.inv_make} ${vehicle.inv_model} Details</h2>
                  <p><strong>Year:</strong> ${vehicle.inv_year}</p>
                  <p><strong>Price:</strong> $${price}</p>
                  <p><strong>Mileage:</strong> ${milage} miles</p>
                  <p><strong>Color:</strong> ${vehicle.inv_color}</p>
                  <p><strong>Description:</strong> ${vehicle.inv_description}</p>
                </div>
              </div>`;
    return detail;
  } else {
    detail = '<p class="notice">Sorry, no matching vehicle could be found.</p>';
    return detail;
  }
};

module.exports = Util;
