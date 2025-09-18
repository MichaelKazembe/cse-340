const utilities = require("../utilities/");
const baseController = {};

baseController.buildHome = async function (req, res) {
  const nav = await utilities.getNav(); // Get the navigation data
  res.render("index", { title: "Home", nav }); // Render the index view with title and navigation data
};

modile.exports = baseController;
