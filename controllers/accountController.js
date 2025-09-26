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

/* ************************
 *  Deliver Registration view
 *************************/
async function buildRegister(req, res, next) {
  let nav = await utilities.getNav();
  res.render("account/register", {
    title: "Register",
    nav,
    errors: null,
  });
}

// Export the controller function to be used in routes
module.exports = { buildLogin, buildRegister };
