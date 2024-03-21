
const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  product_id: String,
  name: String,
  category: String,
  price: String,
  productPath: String,
  description: String,
  studentId: String,

  offers: [
    {
      userId: String,
      offerAmount: Number,
      date: { type: Date, default: Date.now },
      offerStatus: String,
      otp: {
        value: String,
        expires: Date,
      },
    }
  ]
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
