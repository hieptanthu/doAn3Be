const mongoose = require("mongoose");

const CardShopSchema = new mongoose.Schema(
  {
    UserId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    items:[{
    ProductId:{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
      Quantity: Number,
    }]
  }
);

const CardShop = mongoose.model("CardShop", CardShopSchema);

module.exports = CardShop;
