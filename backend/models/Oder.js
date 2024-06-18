const mongoose = require("mongoose");


const OderSchema = new mongoose.Schema(
  {
    UserId: String,
    FullName:String,
    NumberPhone:String,
    Email:String,
    Address:String,
    Node:String,
    DiscountCode:String,
    Detail:[
        { ProductId:{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
        Quantity:String,
        Price:Number
        }
    ],
    Pay:String,
    Status:Number,
    Total:Number
    
  
  },
  {
    timestamps: true
  }
);
const Oder = mongoose.model("Oder", OderSchema);

module.exports = Oder;
