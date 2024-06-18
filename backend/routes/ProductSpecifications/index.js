const { Router } = require("express");
const { ProductSpecifications_Model } = require("../../models");
const ProductSpecificationsRouter = Router();

ProductSpecificationsRouter.get("/:ProductId", async (req, res, next) => {
  try {

    const {
      params: { ProductId },
    } = req;


    const dataOut = await ProductSpecifications_Model.find({ ProductId })

    res.status(200).send({
      success: true,
      message: "ProductSpecifications successfully retrieved",
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



ProductSpecificationsRouter.post("/", async (req, res, next) => {
  try {


    const {
      body: { Name, ListDetail ,ProductId},
    } = req;

    const datain = { Name, ListDetail, ProductId }


    const dataOut = await ProductSpecifications_Model.create(datain);

    res.status(200).send({
      success: true,
      message: "ProductSpecifications successfully create",
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


ProductSpecificationsRouter.put("/:_id", async (req, res, next) => {
  try {


    const {
      body: { Name, ListDetail ,ProductId},
      params:{_id}
    } = req;

    const datain = { Name, ListDetail, ProductId }


    const dataOut = await ProductSpecifications_Model.findByIdAndUpdate(_id,datain);

    res.status(200).send({
      success: true,
      message: "ProductSpecifications successfully create",
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



ProductSpecificationsRouter.delete("/:_id", async (req, res, next) => {
  try {
    const {
      params: { _id },

    } = req;

    const dataOut = await ProductSpecifications_Model.findByIdAndDelete({ _id })

    res.status(200).send({
      success: true,
      message: "ProductSpecifications successfully delete",
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


module.exports = { route: ProductSpecificationsRouter, name: "ProductSpecifications" };