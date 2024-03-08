const mongoose = require("mongoose");

const soldproductSchema = new mongoose.Schema({
  id:String,
  name: String,
  category: String,
  price: String,
  productPath: String,
  description: String,
  ownerId: String,
  acceptedId : String,
  acceptedAmount : String
});

const soldProduct = mongoose.model("SoldProduct", soldproductSchema);

module.exports = soldProduct;
