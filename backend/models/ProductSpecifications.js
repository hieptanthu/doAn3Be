const mongoose = require("mongoose");;

const ProductSpecificationsSchema = new mongoose.Schema(
  {
    ProductId:{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    Name:String,
    ListDetail:[{
        Name:String,
        Detail:String
    }]
  },
  {
    timestamps: true
  }
);
const ProductSpecifications = mongoose.model("ProductSpecifications", ProductSpecificationsSchema);

module.exports = ProductSpecifications;
