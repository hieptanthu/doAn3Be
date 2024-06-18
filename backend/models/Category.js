const mongoose = require("mongoose");

const CategorySchema = new mongoose.Schema(
  {
    Name: String,
    Title: String,
    childCategory:[{
      Name: String,
      Title: String,
      childCategory:[{Name: String,
        Title: String}]
    }]
  }
);

const Category = mongoose.model("Category", CategorySchema);

module.exports = Category;
