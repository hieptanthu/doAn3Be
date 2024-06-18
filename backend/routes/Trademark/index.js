const { Router } = require("express");
const { Trademark_Model } = require("../../models");
const TrademarkRouter = Router();
const upload = require("../../tool/creactlink");
const { handleJwt } = require("../../utils/handleJwt");

TrademarkRouter.get("/",async (req, res, next) => {
  try {


    const dataOut = await Trademark_Model.find({})
    const serverAddress = req.protocol + '://' + req.get('host');

    dataOut.map(item => { return item.Img = serverAddress + "\\" + item.Img })


    res.status(200).send({
      success: true,
      message: "Users successfully retrieved",
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



TrademarkRouter.post("/",upload.array('files', 1), async (req, res, next) => {
  try {


    const {
      body: { Name, Title },
    } = req;



    const datain = { Name, Title }
    if (req.files) {

      datain.Img = req.files.map(file => file.path)[0];
    }

    const dataOut = await Trademark_Model.create(datain)

    res.status(200).send({
      success: true,
      message: "Trademark successfully create",
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


TrademarkRouter.put("/:_id", upload.array('files', 1), async (req, res, next) => {
  try {

    const {
      body: { Name, Title },
      params: { _id },

    } = req; 

    const datain = { Name, Title }
    if (req.files) {

      datain.Img = req.files.map(file => file.path)[0];
    }
    console.log(datain)
    const dataOut = await Trademark_Model.findByIdAndUpdate({ _id }, datain)

    res.status(200).send({
      success: true,
      message: "Trademark successfully  put",
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







TrademarkRouter.delete("/:_id", async (req, res, next) => {
  try {
    const {
      params: { _id },

    } = req;

    const dataOut = await Trademark_Model.findByIdAndDelete( _id )

    res.status(200).send({
      success: true,
      message: "Trademark successfully delete",
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


module.exports = { route: TrademarkRouter, name: "Trademark" };