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
      grid += '<img src="' + vehicle.inv_thumbnail + '" alt="Image of ';
      grid += vehicle.inv_make + " " + vehicle.inv_model + '">';
      grid += '<div class="namePrice">';
      grid += "<hr />";
      grid += "<h2>";
      grid +=
        '<a href="../../inv/detail/' +
        vehicle.inv_id +
        '" title="View ' +
        vehicle.inv_make +
        ' details">' +
        vehicle.inv_make +
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
    grid = '<p class="notice">Sorry, no matching vehicles could be found.</p>';
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
    const price =
      vehicle.inv_price !== undefined && vehicle.inv_price !== null
        ? new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
          }).format(vehicle.inv_price)
        : "N/A";
    const milage =
      vehicle.inv_miles !== undefined && vehicle.inv_miles !== null
        ? new Intl.NumberFormat("en-US").format(vehicle.inv_miles)
        : "N/A";
    detail = `
      <div class="car-detail-grid">
        <div class="car-detail-image">
          <img src="${vehicle.inv_image}" alt="${vehicle.inv_make} ${vehicle.inv_model}" />
        </div>
        <div class="car-detail-info">
          <h2 class="car-title">${vehicle.inv_year} ${vehicle.inv_make} ${vehicle.inv_model}</h2>
          <div class="car-detail-list">
            <div class="car-detail-row"><span class="car-label">Price:</span> <span class="car-value">${price}</span></div>
            <div class="car-detail-row"><span class="car-label">Mileage:</span> <span class="car-value">${milage} miles</span></div>
            <div class="car-detail-row"><span class="car-label">Color:</span> <span class="car-value">${vehicle.inv_color}</span></div>
            <div class="car-detail-row"><span class="car-label">Year:</span> <span class="car-value">${vehicle.inv_year}</span></div>
          </div>
          <div class="car-description">
            <h3>Description</h3>
            <p>${vehicle.inv_description}</p>
          </div>
        </div>
      </div>
    `;
    return detail;
  } else {
    detail = '<p class="notice">Sorry, no matching vehicle could be found.</p>';
    return detail;
  }
};

module.exports = Util;
