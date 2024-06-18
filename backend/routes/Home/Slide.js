const { Router } = require("express");
const { Silde_Model } = require("../../models");
const upload = require("../../tool/creactlink");
const SildeRouter = Router();


SildeRouter.get("/", async (req, res, next) => {
  try {

   
    const Silde = await Silde_Model.findOne().sort({ updatedAt: -1 });
    const serverAddress = req.protocol + '://' + req.get('host');
    Silde.Img=serverAddress+"\\"+Silde.Img
    res.status(200).send({
      success: true,
      message: "Silde successfully retrieved",
      Silde,

    });

  }
  catch (error) {
    res.status(404).send({
      success: false,
      message: error,
    });
  }

});



SildeRouter.post("/", upload.array('files', 1), async (req, res, next) => {
  try {


    const {
      body: { Name, Title, Describe, Link },
    } = req;


    const datain = { Name, Title, Describe, Link }

    if (req.files) {
       datain.Img = req.files.map(file => file.path)[0];
    }

    const Silde = await Silde_Model.create(datain)

    res.status(200).send({
      success: true,
      message: "Silde successfully create",
      Silde,

    });

  }
  catch (error) {
    res.status(404).send({
      success: false,
      message: error,
    });
  }

});


SildeRouter.put("/:_id", upload.array('files', 1), async (req, res, next) => {
  try {

    const {
      body: { Name, Title, Describe, Link},
      params: { _id },

    } = req;
   
    const datain = { Name, Title, Describe, Link }

    if (req.files) {

      datain.Img = req.files.map(file => file.path)[0];
    }


   


    const Silde = await Silde_Model.findByIdAndUpdate({ _id }, datain)

    res.status(200).send({
      success: true,
      message: "Silde successfully  put",
      Silde,

    });

  }
  catch (error) {
    res.status(404).send({
      success: false,
      message: error,
    });
  }

});







SildeRouter.delete("/:_id", async (req, res, next) => {
  try {
    const {
      params: { _id },

    } = req;
    const Silde = await Silde_Model.findByIdAndDelete({ _id })
    res.status(200).send({
      success: true,
      message: "Silde successfully delete",
      Silde,

    });

  }
  catch (error) {
    res.status(404).send({
      success: false,
      message: error,
    });
  }

});


module.exports = { route: SildeRouter, name: "Silde" };