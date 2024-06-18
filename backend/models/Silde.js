const mongoose = require("mongoose");
const { types } = require("pg");

const SildeSchema = new mongoose.Schema(
  {
    Name: String,
    Title: String,
    Describe: String,
    Link: String,
    Img: String // Array of strings
  },
  {
    timestamps: true
  }
);
const Silde = mongoose.model("Silde", SildeSchema);

module.exports = Silde;
