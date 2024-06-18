const mongoose = require("mongoose");


const TrendingItemsSchema = new mongoose.Schema(
  {
    Name:String,
    ListProduct:[{type: mongoose.Schema.Types.ObjectId, ref: 'Product' }]

  },
  {
    timestamps: true
  }
);
const TrendingItems = mongoose.model("TrendingItems", TrendingItemsSchema);

module.exports = TrendingItems;
