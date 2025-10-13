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

/* *****************************
 * Return account data using email address
 * ***************************** */
async function getAccountByEmail(account_email) {
  try {
    const sql =
      "SELECT account_id, account_firstname, account_lastname, account_email, account_type, account_password FROM public.account WHERE account_email = $1";
    const result = await pool.query(sql, [account_email]);
    return result.rows[0];
  } catch (error) {
    return new Error("No matching email found.");
  }
}

/* *****************************
 * Return account data using account ID
 * ***************************** */
async function getAccountById(account_id) {
  try {
    const sql =
      "SELECT account_id, account_firstname, account_lastname, account_email, account_type FROM public.account WHERE account_id = $1";
    const result = await pool.query(sql, [account_id]);
    return result.rows[0];
  } catch (error) {
    return new Error("No matching account ID found.");
  }
}

/* *****************************
 * Update account information
 * ***************************** */
async function updateAccount(
  account_id,
  account_firstname,
  account_lastname,
  account_email
) {
  try {
    const sql = "UPDATE public.account SET account_firstname = $1, account_lastname = $2, account_email = $3 WHERE account_id = $4 RETURNING *";
    const result = await pool.query(sql, [
      account_firstname,
      account_lastname,
      account_email,
      account_id,
    ]);
    return result;
  } catch (error) {
    return error.message;
  }
}

/* *****************************
  * Update Password by account_id
  * ***************************** */
 async function updatePassword(account_id, new_hashed_password) {
  try {
    const sql = "UPDATE public.account SET account_password = $1 WHERE account_id = $2 RETURNING *";
    const result = await pool.query(sql, [new_hashed_password, account_id]);
    return result;
  } catch (error) {
    return error.message;
  }
}

module.exports = {
  registerAccount,
  checkExistingEmail,
  loginAccount,
  getAccountByEmail,
  getAccountById,
  updateAccount,
  updatePassword,
}; // Export the function to be used in accountController.js
