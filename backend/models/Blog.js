const mongoose = require("mongoose");;

const BlogSchema = new mongoose.Schema(
  {
    Name:String,
    Title:String,
    Data: String
  },
  {
    timestamps: true
  }
);
const Blog = mongoose.model("Blog", BlogSchema);

module.exports = Blog;
