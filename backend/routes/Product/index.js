const { Router } = require("express");
const { Product_Model } = require("../../models");
const ProductRouter = Router();
const upload = require("../../tool/creactlink");
ProductRouter.post("/find", async (req, res, next) => {
  try {

    const { Name, categoryId, TrademarkId, PriceMin, PriceMax, ListProduct, Page, PageSize } = req.body;
    const query = {};
    const page = Page || 1; // You can get this value from request query parameters
    const limit = PageSize || 10; // You can get this value from request query parameters

    const skip = (page - 1) * limit;


    if (Name) {
      query.Name = { $regex: Name, $options: "i" }
    }
    if (categoryId) {
      query.categoryId = { $in: categoryId };
    }
    if (TrademarkId) {
      query.TrademarkId = TrademarkId;
    }

    if (ListProduct) {
      query._id = { $in: ListProduct };
    }

    if (PriceMin !== undefined || PriceMax !== undefined) {
      query.Price = {};
      if (PriceMin !== undefined) {
        query.Price.$gte = PriceMin;
      }
      if (PriceMax !== undefined) {
        query.Price.$lte = PriceMax;
      }
    }

    console.log(query)


    const projection = { Name: 1, Title: 1, Price: 1, Img: 1, Quantity: 1,categoryId:1 };

  
    const [dataOut, totalItems] = await Promise.all([
      Product_Model.find(query, projection).skip(skip).limit(limit),
      Product_Model.countDocuments(query)
    ]);






    if (totalItems > 0) {


      const serverAddress = req.protocol + '://' + req.get('host');
      dataOut.forEach(item => {
        if (item.Img && item.Img.length > 0) {
          item.Img = item.Img.map(item2 => serverAddress + "\\" + item2);
        }
      });







    }






    const totalPages = Math.ceil(totalItems / limit);

    res.status(200).send({
      success: true,
      message: "Product successfully retrieved",
      dataOut,
      page: page,
      totalPages: totalPages,
      totalItems: totalItems

    });

  } catch (error) {
    res.status(404).send({
      success: false,
      message: error.message,
    });
  }
});




ProductRouter.get("/:_id", async (req, res, next) => {
  try {
    const {
      params: { _id },

    } = req;

    const dataOut = await Product_Model.findById(_id)

    const serverAddress = req.protocol + '://' + req.get('host');

    if (dataOut.Img && dataOut.Img.length > 0) {
      dataOut.Img = dataOut.Img.map(item2 => serverAddress + "\\" + item2);
    }


    res.status(200).send({
      success: true,
      message: "Product successfully retrieved",
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










ProductRouter.post("/", upload.array('files', 5), async (req, res, next) => {
  try {
    const {
      body: { Name, Title, categoryId, TrademarkId, Price, Describe, ListHighlights, Quantity },
      files
    } = req;



    const dataListHighlights = ListHighlights.split(",");
    let Img = [];
    if (files) {
      Img = files.map(file => file.path);
    }

    const datain = { Name, Title, categoryId, TrademarkId, Price, Describe, ListHighlights: dataListHighlights, Img, Quantity };
    const dataOut = await Product_Model.create(datain);

    res.status(200).send({
      success: true,
      message: "Product successfully created",
      dataOut,
    });
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).send({
      success: false,
      message: "Error creating product",
      error: error.message,
    });
  }
});



ProductRouter.put("/:_id", upload.array('files', 5), async (req, res, next) => {
  try {

    const {
      body: { Name, Title, categoryId, TrademarkId, Price, Describe, ListHighlights, Quantity },
      params: { _id },

    } = req;

    const dataListHighlights = ListHighlights.split(",");
    const datain = { Name, Title, categoryId, TrademarkId, Price, Describe, ListHighlights: dataListHighlights, Quantity };
    if (req.files && req.files.length > 0) {
      datain.Img = req.files.map(file => file.path);
    }

    console.log(datain)
    const dataOut = await Product_Model.findByIdAndUpdate({ _id }, datain)

    res.status(200).send({
      success: true,
      message: "Product successfully  put",
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







ProductRouter.delete("/:_id", async (req, res, next) => {
  try {
    const {
      params: { _id },

    } = req;

    const dataOut = await Product_Model.findByIdAndDelete(_id)

    res.status(200).send({
      success: true,
      message: "Product successfully delete",
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


module.exports = { route: ProductRouter, name: "Product" };