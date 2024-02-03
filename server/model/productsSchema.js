const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: String,
  category: String,
  price: String,
  productPath: String, // Use responseData.objectUrl directly
  studentId: String,
});

const products = new mongoose.model("products", productSchema);

module.exports = products;
