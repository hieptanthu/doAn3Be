const mongoose = require("mongoose");

const TrademarkSchema = new mongoose.Schema(
  {
    Name: String,
    Title: String,
    Img:String
  },
  {
    timestamps: true
  }
);

const Trademark = mongoose.model("Trademark", TrademarkSchema);

module.exports = Trademark;
