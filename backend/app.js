const express = require("express");
const { initializeRoutes } = require("./routes");
const path = require('path');
const cors = require('cors');
const mongoose = require("mongoose");
express.json()
require('dotenv').config()

mongoose.connect("mongodb://localhost:27017/newMayanh")
  .then(() => {
    console.log("Connected to MongoDB successfully!");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });



let app = express();
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const corsOptions = {
  origin: ['*','http://localhost:3000'] ,// Allow requests from this origin
  optionsSuccessStatus: 200, // Some legacy browsers (IE11, various SmartTVs) choke on 204
};

app.use(cors(corsOptions));

const port =  process.env.Port||4000

app = initializeRoutes(app);

app.get("/", (req, res) => {
  res.status(200).send({
    success: true,
    message: "welcome to the beginning of greatness",
  });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
