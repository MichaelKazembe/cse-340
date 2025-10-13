const jwt = require("jsonwebtoken");
require("dotenv").config();
const bcrypt = require("bcryptjs");
const utilities = require("../utilities/");
const accountModel = require("../models/account-model");

/* ************************
 *  Deliver Login view
 *************************/
async function buildLogin(req, res, next) {
  let nav = await utilities.getNav();
  res.render("account/login", {
    title: "Login",
    nav,
    errors: null,
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

/* ************************
 *  Process Registration
 * ************************ */

async function registerAccount(req, res) {
  let nav = await utilities.getNav();
  const {
    account_firstname,
    account_lastname,
    account_email,
    account_password,
  } = req.body;

  // Hash the password before storing
  let hashedPassword;
  try {
    // Regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hashSync(account_password, 10);
  } catch (error) {
    req.flash(
      "notice",
      "Sorry, there was an error processing the registration."
    );
    res.status(500).render("account/register", {
      title: "Register",
      nav,
      errors: null,
    });
    return;
  }

  const regResult = await accountModel.registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    hashedPassword
  );

  if (regResult) {
    req.flash(
      "success",
      `Congratulations! you're registered, ${account_firstname} ${account_lastname}. Please log in.`
    );
    res.status(201).render("account/login", {
      title: "Login",
      nav,
      errors: null,
    });
  } else {
    req.flash("warning", "Sorry, the registration failed.");
    res.status(501).render("account/register", {
      title: "Register",
      nav,
    });
  }
}

/* ****************************************
 *  Process login request
 * ************************************ */
async function accountLogin(req, res) {
  let nav = await utilities.getNav();
  const { account_email, account_password } = req.body;
  const accountData = await accountModel.getAccountByEmail(account_email);
  if (!accountData) {
    req.flash("notice", "Please check your credentials and try again.");
    res.status(400).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      account_email,
    });
    return;
  }
  try {
    if (await bcrypt.compare(account_password, accountData.account_password)) {
      delete accountData.account_password;
      const accessToken = jwt.sign(
        accountData,
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: 3600 * 1000 }
      );
      if (process.env.NODE_ENV === "development") {
        res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 });
      } else {
        res.cookie("jwt", accessToken, {
          httpOnly: true,
          secure: true,
          maxAge: 3600 * 1000,
        });
      }
      return res.redirect("/account/");
    } else {
      req.flash(
        "message notice",
        "Please check your credentials and try again."
      );
      res.status(400).render("account/login", {
        title: "Login",
        nav,
        errors: null,
        account_email,
      });
    }
  } catch (error) {
    throw new Error("Access Forbidden");
  }
}

/* ****************************************
 *  Build Account Management view
 * ************************************ */
async function buildAccountManagement(req, res, next) {
  let nav = await utilities.getNav();
  res.render("account/acc-management", {
    title: "Account Management",
    nav,
    errors: null,
  });
}

/* ****************************************
 *  Build Account Update view
 * ************************************ */
async function buildAccountUpdate(req, res, next) {
  let nav = await utilities.getNav();
  const account_id = parseInt(req.params.account_id);
  const accountData = await accountModel.getAccountById(account_id);
  if (parseInt(res.locals.accountData.account_id) !== account_id) {
    req.flash("notice", "You can only update your own account.");
    return res.redirect("/account/");
  }
  if (!accountData) {
    req.flash("notice", "No account information found.");
    return res.redirect("/account/");
  }
  res.render("account/acc-update", {
    title: "Account Update",
    nav,
    errors: null,
    account_firstname: accountData.account_firstname,
    account_lastname: accountData.account_lastname,
    account_email: accountData.account_email,
  });
}

/* ****************************************
 *  Process Account Update
 * ************************************ */
async function processAccountUpdate(req, res) {
  let nav = await utilities.getNav();
  const { account_id, account_firstname, account_lastname, account_email } =
    req.body;
  if (parseInt(res.locals.accountData.account_id) !== parseInt(account_id)) {
    req.flash("notice", "You can only update your own account.");
    return res.redirect("/account/");
  }
  const updateResult = await accountModel.updateAccount(
    account_id,
    account_firstname,
    account_lastname,
    account_email
  );
  if (updateResult) {
    req.flash("success", "Account information updated.");
  }
  res.status(200).render("account/acc-management", {
    title: "Account Management",
    nav,
    errors: null,
  });
}

/* ****************************************
 *  Process Password Update
 * ************************************ */
async function processChangePassword(req, res) {
  let nav = await utilities.getNav();
  const { account_id, new_password } = req.body;
  if (parseInt(res.locals.accountData.account_id) !== parseInt(account_id)) {
    req.flash("notice", "You can only update your own account.");
    return res.redirect("/account/");
  }
  let hashedPassword;
  try {
    // Regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hashSync(new_password, 10);
  } catch (error) {
    req.flash(
      "notice",
      "Sorry, there was an error processing the password change."
    );
    res.status(500).render("account/acc-update", {
      title: "Account Update",
      nav,
      errors: null,
      account_firstname: res.locals.accountData.account_firstname,
      account_lastname: res.locals.accountData.account_lastname,
      account_email: res.locals.accountData.account_email,
    });
    return;
  }
  const updateResult = await accountModel.updatePassword(
    account_id,
    hashedPassword
  );
  if (updateResult) {
    req.flash("success", "Password updated.");
  } else {
    req.flash("warning", "Sorry, the password update failed.");
  }
  res.status(200).render("account/acc-management", {
    title: "Account Management",
    nav,
    errors: null,
  });
}

/* ****************************************
 *  Process logout request
 * ************************************ */
async function accountLogout(req, res) {
  res.clearCookie("jwt");
  return res.redirect("/");
}


module.exports = {
  buildLogin,
  buildRegister,
  registerAccount,
  accountLogin,
  buildAccountManagement,
  buildAccountUpdate,
  processAccountUpdate,
  processChangePassword,
  accountLogout,
};
