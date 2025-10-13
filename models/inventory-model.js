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
async function getClassificationByName(classification_name) {
  try {
    const sql =
      "SELECT classification_name FROM public.classification WHERE classification_name=$1";
    return await pool.query(sql, [classification_name]);
  } catch (error) {
    console.log("getClassificationByName error" + error);
  }
}

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

/* ***************************
 *  Create a new inventory item in the inventory table
 * ************************** */
async function createNewInventoryItem(inv_data) {
  try {
    const sql =
      "INSERT INTO public.inventory (inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)";
    return await pool.query(sql, [
      inv_data.inv_make,
      inv_data.inv_model,
      inv_data.inv_year,
      inv_data.inv_description,
      inv_data.inv_image,
      inv_data.inv_thumbnail,
      inv_data.inv_price,
      inv_data.inv_miles,
      inv_data.inv_color,
      inv_data.classification_id,
    ]);
  } catch (error) {
    console.log("createNewInventoryItem error" + error);
  }
}

/* ***************************
 *  Update an inventory item in the inventory table
 * ************************** */
async function updateInventory(
  inv_id,
  inv_make,
  inv_model,
  inv_year,
  inv_description,
  inv_image,
  inv_thumbnail,
  inv_price,
  inv_miles,
  inv_color,
  classification_id
) {
  try {
    const sql =
      "UPDATE public.inventory SET inv_make = $1, inv_model = $2, inv_year = $3, inv_description = $4, inv_image = $5, inv_thumbnail = $6, inv_price = $7, inv_miles = $8, inv_color = $9, classification_id = $10 WHERE inv_id = $11 RETURNING *";
    const data = await pool.query(sql, [
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
      classification_id,
      inv_id,
    ]);
    return data.rows[0];
  } catch (error) {
    console.log("Model error" + error);
  }
}

module.exports = {
  getClassifications, // Export the functions to be used in baseController.js
  getInventoryByClassificationId, // Export the functions to be used in invController.js
  getInventoryById, // Export the functions to be used in invController.js
  createNewClassification, // Export the function to be used in invController.js
  getClassificationByName, // Export the function to be used in InvController.js
  createNewInventoryItem, // Export the function to be used in invController.js
  updateInventory, // Export the function to be used in invController.js
};
