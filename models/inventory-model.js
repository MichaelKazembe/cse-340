const pool = require("../database/index.js"); // imports the connection pool from the database module

/* ***************************
 *  Get all classification data
 * ************************** */
async function getClassifications() {
  return await pool.query(
    "SELECT * FROM public.classification ORDER BY classification_name"
  );
}

/* ***************************
 *  Create a new classification in the classification table
 * ************************** */
async function createNewClassification(classification_name) {
  try {
    const sql =
      "INSERT INTO public.classification (classification_name) VALUES ($1)";
    return await pool.query(sql, [classification_name]);
  } catch (error) {
    console.log("createNewClassification error" + error);
  }
}

/* ***************************
 *  Get classification_name
 * ************************** */
// async function getClassificationByName(classification_name) {
//   try {
//     const sql =
//       "SELECT classification_name FROM public.classification WHERE classification_name=$1";
//     return await pool.query(sql, [classification_name]);
//   } catch (error) {
//     console.log("getClassificationByName error" + error);
//   }
// }

/* ***************************
 *  Get all inventory items and classification_name by classification_id
 * ************************** */
async function getInventoryByClassificationId(classification_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory AS i
      JOIN public.classification AS c
      ON i.classification_id = c.classification_id
      WHERE i.classification_id = $1`,
      [classification_id]
    );
    console.log(data.rows);
    return data.rows; // Return only the rows from the query result
  } catch (error) {
    console.log("getClassificationById error " + error);
  }
}

/* ***************************
 *  Get all inventory item by inv_id
 * ************************** */
async function getInventoryById(inv_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory
      WHERE inv_id = $1`,
      [inv_id]
    );
    console.log(data.rows); // Log the data for debugging
    return data.rows; // Return only the rows from the query result
  } catch (error) {
    console.log("getInventoryById error " + error);
  }
}

module.exports = {
  getClassifications, // Export the functions to be used in baseController.js
  getInventoryByClassificationId, // Export the functions to be used in invController.js
  getInventoryById, // Export the functions to be used in invController.js
  createNewClassification, // Export the function to be used in invController.js
  // getClassificationByName, // Export the function to be used in InvController.js
};
