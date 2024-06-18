const mongoose = require("mongoose");


const ProductSchema = new mongoose.Schema(
  {
    Name: String,
    Title: String,
    categoryId:  mongoose.Schema.Types.ObjectId,
    TrademarkId: { type: mongoose.Schema.Types.ObjectId, ref: 'Trademark' },
    Price: Number,
    Describe: String,
    Quantity: Number,
    Img: [String],
    ListHighlights: [String]
  },
  {
    timestamps: true
  }
);
const Product = mongoose.model("Product", ProductSchema);

module.exports = Product;
