const { Router } = require("express");
const { Category_Model } = require("../../models");
const { addChildCategoryToLevel3 ,putChildCategoryToLevel3 ,deleteChildCategoryToLevel3} = require("../../TruyVanData/category");
const CategoryRouter = Router();


CategoryRouter.get("/", async (req, res, next) => {
  try {


    const Categories = await Category_Model.find({})

    res.status(200).send({
      success: true,
      message: "Users successfully retrieved",
      Categories,

    });

  }
  catch (error) {
    res.status(404).send({
      success: false,
      message: error,
    });
  }

});


CategoryRouter.post("/ById", async (req, res, next) => {
  try {
    const { categoryId } = req.body;


   

    let Categories
    if (categoryId.length == 0) {
      Categories = await Category_Model.find({})
    }
    else if (categoryId.length == 1) {
      Categories = await Category_Model.findOne({ _id: categoryId[0] })
    }


    else if (categoryId.length == 2) {
      // Categories = await Category_Model.findOne({
      //   _id: categoryId[0],
      //   "childCategory._id": categoryId[1]
      // }, {
      //   $unwind: "childCategory._id"
      // }, {
      //   $match: { "childCategory._id": categoryId[1] }
      // },
      //   { $projectL:{"childCategory._id":1} }
      // )


      Categories = await Category_Model.findOne({ _id: categoryId[0] })

      const data= Categories.childCategory.map(item=>{
        if(item._id==categoryId[1]) return item
      })
      Categories=data[0]
    }





   
    res.status(200).send({
      success: true,
      message: "Users successfully retrieved",
      Categories,

    });

  }
  catch (error) {
    res.status(404).send({
      success: false,
      message: error,
    });
  }

});



CategoryRouter.post("/", async (req, res, next) => {
  try {


    const {
      body: { ListId, Name, Title },
    } = req;






    const Category = await addChildCategoryToLevel3(ListId, { Name, Title ,childCategory:[]})
    res.status(200).send({
      success: true,
      message: "Category successfully create",
      Category,

    });

  }
  catch (error) {
    res.status(404).send({
      success: false,
      message: error,
    });
  }

});


CategoryRouter.put("/", async (req, res, next) => {
  try {

    const {
      body: { ListId, Name, Title },

    } = req;

    const Category = await putChildCategoryToLevel3(ListId, { Name, Title })

    res.status(200).send({
      success: true,
      message: "Category successfully  put",
      Category,

    });

  }
  catch (error) {
    res.status(404).send({
      success: false,
      message: error,
    });
  }

});







CategoryRouter.delete("/", async (req, res, next) => {
  try {
    const {
      body: { ListId },

    } = req;

    const Category = await deleteChildCategoryToLevel3(ListId)

    res.status(200).send({
      success: true,
      message: "Category successfully delete",
      Category,

    });

  }
  catch (error) {
    res.status(404).send({
      success: false,
      message: error,
    });
  }

});


module.exports = { route: CategoryRouter, name: "category" };