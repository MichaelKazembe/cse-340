const utilities = require("../utilities/");
const baseController = {}; // Initialize an empty object to hold controller methods
// Define a method to build the home page
baseController.buildHome = async function (req, res) {
  const nav = await utilities.getNav(); // Get the navigation data
  req.flash("notice", "This is a flash message."); // Set a flash message
  res.render("index", { title: "Home", nav }); // Render the index view with title and navigation data
};

module.exports = baseController;
