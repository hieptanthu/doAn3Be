const { Router } = require("express");
const { Blog_Model } = require("../../models");
const BlogRouter = Router();

BlogRouter.post("/find", async (req, res, next) => {
  try {
    const { Name, Sort, Page, PageSize } = req.body

    const query = {};
    const page = Page || 1; // You can get this value from request query parameters
    const limit = PageSize || 10; // You can get this value from request query parameters
    const skip = (page - 1) * limit;
    if (Name) {
      query.Name = { $regex: Name, $options: "i" }
    }
    console.log(query)
    const projection = {
      Name: 1, Title: 1, createdAt: 1
    }

    const [dataOut, totalItems] = await Promise.all([
      Blog_Model.find(query, projection).skip(skip).limit(limit).sort(Sort || { createdAt: -1 }),
      Blog_Model.countDocuments(query)
    ]);

    const totalPages = Math.ceil(totalItems / limit);



    res.status(200).send({
      success: true,
      message: "Blog successfully retrieved",
      dataOut: dataOut,
      page: page,
      totalPages: totalPages,
      totalItems: totalItems

    });



  }
  catch (error) {
    res.status(404).send({
      success: false,
      message: error,
    });
  }

});


BlogRouter.get("/:_id", async (req, res, next) => {
  try {


    const {
      params: { _id },
    } = req;




    const dataOut = await Blog_Model.findById(_id)

    res.status(200).send({
      success: true,
      message: "Blog successfully create",
      dataOut,

    });

  }
  catch (error) {
    res.status(404).send({
      success: false,
      message: error,
    });
  }

});



BlogRouter.post("/", async (req, res, next) => {
  try {


    const {
      body: { Name, Title, Data },
    } = req;



    const datain = { Name, Title, Data }

    const dataOut = await Blog_Model.create(datain)

    res.status(200).send({
      success: true,
      message: "Blog successfully create",
      dataOut,

    });

  }
  catch (error) {
    res.status(404).send({
      success: false,
      message: error,
    });
  }

});


BlogRouter.put("/:_id", async (req, res, next) => {
  try {

    const {
      body: { Name, Title, Data },
      params: { _id },

    } = req;

    const datain = { Name, Title, Data }

    const dataOut = await Blog_Model.findByIdAndUpdate({ _id }, datain)

    res.status(200).send({
      success: true,
      message: "Blog successfully  put",
      dataOut,

    });

  }
  catch (error) {
    res.status(404).send({
      success: false,
      message: error,
    });
  }

});







BlogRouter.delete("/:_id", async (req, res, next) => {
  try {
    const {
      params: { _id },

    } = req;

    const dataOut = await Blog_Model.findByIdAndDelete(_id)

    res.status(200).send({
      success: true,
      message: "Blog successfully delete",
      dataOut,

    });

  }
  catch (error) {
    res.status(404).send({
      success: false,
      message: error,
    });
  }

});


module.exports = { route: BlogRouter, name: "Blog" };