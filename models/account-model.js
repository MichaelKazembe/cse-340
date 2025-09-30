const pool = require("../database/index.js"); // imports the connection pool from the database module

/* ***************************
 *  Register a new account
 * ************************** */
async function registerAccount(
  account_firstname,
  account_lastname,
  account_email,
  account_password
) {
  try {
    const sql =
      "INSERT INTO public.account (account_firstname, account_lastname, account_email, account_password, account_type) VALUES ($1, $2, $3, $4, 'Client') RETURNING *";
    return await pool.query(sql, [
      account_firstname,
      account_lastname,
      account_email,
      account_password,
    ]);
  } catch (error) {
    return error.message;
  }
}

/* *******************
 * check for existing email
 * ****************** */
async function checkExistingEmail(account_email) {
  try {
    const sql = "SELECT * FROM public.account WHERE account_email = $1";
    const email = await pool.query(sql, [account_email]);
    return email.rowCount;
  } catch (error) {
    return error.message;
  }
}

/* ***************************
 *  Login account
 * ************************** */
async function loginAccount(account_email, account_password) {
  try {
    const sql = "SELECT * FROM public.account WHERE account_email = $1";
    const accountData = await pool.query(sql, [account_email]);
    if (accountData.rowCount === 0) {
      return false;
    }
    // Compare the password provided with the hashed password stored in the database
    const passwordMatch = await bcrypt.compare(
      account_password,
      accountData.rows[0].account_password
    );
    if (passwordMatch) {
      return accountData.rows[0];
    } else {
      return false;
    }
  } catch (error) {
    return error.message;
  }
}

module.exports = { registerAccount, checkExistingEmail, loginAccount }; // Export the function to be used in accountController.js
