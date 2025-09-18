const invModel = require("../models/inventory-model");
const Util = {}; // container for all utility functions

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications(); // get the array of classifications
  console.log(data); // logs the array of objects to the terminal
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

module.exports = Util;
