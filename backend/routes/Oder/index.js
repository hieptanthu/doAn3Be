const { Router } = require("express");
const { Oder_Model, Product_Model } = require("../../models");
const OderRouter = Router();



OderRouter.get("/Quantity", async (req, res, next) => {
    try {


        const [status1, status2,status3,status4] = await Promise.all([
            await Oder_Model.countDocuments({Status:1}),
            await Oder_Model.countDocuments({Status:2}),
            await Oder_Model.countDocuments({Status:3}),
            await Oder_Model.countDocuments({Status:4}),
          ]);
        res.status(200).send({
            success: true,
            message: "Users successfully retrieved",
            status1,
            status2,
            status3,
            status4,


        });

    }
    catch (error) {
        res.status(404).send({
            success: false,
            message: error,
        });
    }

});

OderRouter.post("/find", async (req, res, next) => {
    try {


        const { text, sort, Status, UserId, Page, PageSize } = req.body

        const page =  Page ||1; // You can get this value from request query parameters
        const limit = PageSize || 10; // You can get this value from request query parameters
        const skip = (page - 1) * limit;
        const query = {};

        console.log(page)

        const searchConditions = [
            { FullName: new RegExp(text, 'i') },
            { NumberPhone: new RegExp(text, 'i') },
            { Email: new RegExp(text, 'i') },
            { Address: new RegExp(text, 'i') },
            { Node: new RegExp(text, 'i') },
            { DiscountCode: new RegExp(text, 'i') }
        ];

        if (text) {
            query.$or = searchConditions
        }



        if (Status) {
            query.Status = Status
        }

        if (UserId) {
            query.UserId = UserId
        }




       


        const [dataOut, totalItems] = await Promise.all([
            await Oder_Model.find(query, { updatedAt: 0,Detail:0 ,UserId:0}).sort(sort).skip(skip).limit(limit),
            await Oder_Model.countDocuments(query, { updatedAt: 0 })
          ]);

          const totalPages = Math.ceil(totalItems / limit);
        res.status(200).send({
            success: true,
            message: "Users successfully retrieved",
            dataOut,
            totalItems,
            totalPages

        });

    }
    catch (error) {
        res.status(404).send({
            success: false,
            message: error,
        });
    }

});



OderRouter.get("/:_id", async (req, res, next) => {
    try {

        const {
            params: { _id }

        } = req;
        const dataOut = await Oder_Model.findById(_id).populate({
            path: 'Detail.ProductId',
            select: '_id Name'
          });

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



OderRouter.post("/", async (req, res, next) => {
    try {

        const {
            body: { UserId, FullName, NumberPhone, Email, Address, Node, Detail, Pay, Status, Total },
        } = req;

       


        const productIds = Detail.map(detail => detail.ProductId);

        const Productes = await Product_Model.find(
            { _id: { $in: productIds } },
            { Price: 1 }
        );
        console.log(req.body)
        Detail.map((item, index) => { item.Price = Productes[index].Price })
        console.log(req.body)
        const datain = { UserId, FullName, NumberPhone, Email, Address, Node, Detail, Pay, Status, Total }
        console.log("ss",datain)
        const dataOut = await Oder_Model.create(datain)
        console.log(datain)
        const bulkOps = Detail.map((data) => ({
            updateOne: {
                filter: { _id: data.ProductId },
                update: { $inc: { Quantity: -data.Quantity } }
            }
        }));
        const result = await Product_Model.bulkWrite(bulkOps);

        console.log(result)

        res.status(200).send({
            success: true,
            message: "Oder successfully create",
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


OderRouter.put("/:_id", async (req, res, next) => {
    try {

        const {
            params: { _id },
            body: { Status }

        } = req;


        console.log(Status)
        const dataOut = await Oder_Model.findByIdAndUpdate(_id , {Status})

        res.status(200).send({
            success: true,
            message: "Oder successfully  put",
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








module.exports = { route: OderRouter, name: "Oder" };