const utilities = require("../utilities/");

/* ************************
 *  Deliver Login view
 *************************/
async function buildLogin(req, res, next) {
  let nav = await utilities.getNav();
  res.render("account/login", {
    title: "Login",
    nav,
  });
}
// Export the controller function to be used in routes
module.exports = { buildLogin };
