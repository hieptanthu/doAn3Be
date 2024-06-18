const { Router } = require("express");
const { TrendingItems_Model } = require("../../models");
const TrendingItemRouter = Router();

TrendingItemRouter.get("/", async (req, res, next) => {
    try {
  

      const dataOut = await TrendingItems_Model.find({})
  
      res.status(200).send({
        success: true,
        message: "TrendingItem successfully retrieved",
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



  TrendingItemRouter.post("/",async (req, res, next) => {
    try {

       
        const {
            body: {Name, ListProduct },
          } = req;


          
          const datain ={ Name, ListProduct }
  

      const dataOut = await TrendingItems_Model.create(datain)
  
      res.status(200).send({
        success: true,
        message: "TrendingItem successfully create",
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


  TrendingItemRouter.put("/:_id", async (req, res, next) => {
    try {
  
        const {
            body:{ Name, ListProduct },
            params: { _id },
            
        } = req;

        const datain ={ Name, ListProduct }
        
      const dataOut = await TrendingItems_Model.findByIdAndUpdate({_id},datain)
  
      res.status(200).send({
        success: true,
        message: "TrendingItem successfully  put",
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







  TrendingItemRouter.delete("/:_id", async (req, res, next) => {
    try {
        const {
            params: { _id },
            
        } = req;

      const dataOut = await TrendingItems_Model.findByIdAndDelete({_id})
  
      res.status(200).send({
        success: true,
        message: "TrendingItem successfully delete",
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


  module.exports = { route: TrendingItemRouter, name: "TrendingItem" };