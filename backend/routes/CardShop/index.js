const { Router } = require("express");
const { CardShop_Model } = require("../../models");
const CardShopRouter = Router();


CardShopRouter.get("/:UserId", async (req, res, next) => {
    try {


        const {
            params: { UserId },

        } = req;


        const CardShops = await CardShop_Model.findOne({ UserId }).populate({
            path: 'items.ProductId',
            select: '_id Name Img Price Quantity' // Only select the Name and Img fields from Product
        });
        if (!CardShops) {
            CardShops = await CardShop_Model.create({ UserId, items: [] })

        }

        console.log(CardShops)

        const serverAddress = req.protocol + '://' + req.get('host');

        CardShops.items.forEach(item1 => {
            item1.ProductId.Img = item1.ProductId.Img.map(item => {
                return serverAddress + "\\" + item;
            });
        });


        console.log("2", CardShops)







        res.status(200).send({
            success: true,
            message: "CardShop successfully retrieved",
            CardShops,

        });

    }
    catch (error) {
        res.status(404).send({
            success: false,
            message: error,
        });
    }

});




CardShopRouter.post("/:UserId", async (req, res, next) => {
    try {


        const {
            params: { UserId },
            body: { ProductId, Quantity }
        } = req;

        let CardShops;
        CardShops = await CardShop_Model.findOne({ UserId })
        if (!CardShops) {
            CardShops = await CardShop_Model.create({ UserId, items: [] })
        }


        const CardShopUpdate = await CardShop_Model.findOne({ UserId, "items.ProductId": ProductId })
        if (CardShopUpdate) {

            res.status(200).send({
                success: true,
                message: "đã có trong giỏ hàng",

            });


        } else {

            const CardShopUpdate = await CardShop_Model.findOneAndUpdate(
                { UserId },
                { $push: { items: { ProductId, Quantity } } },
                { new: true }
            )
            if (CardShopUpdate) {
                res.status(200).send({
                    success: false,
                    message: "đã thêm vào giỏ hàng",

                });
            }

        }


    }

    catch (error) {
        res.status(404).send({
            success: false,
            message: error,
        });
    }

});




CardShopRouter.put("/:UserId", async (req, res, next) => {
    try {


        const {
            params: { UserId },
            body: { items }
        } = req;


        const cardShop = await CardShop_Model.findOne({ UserId });

        if (!cardShop) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Update the quantities of the items
        items.forEach(item => {
            const existingItem = cardShop.items.find(i => i._id.toString() === item._id);

            if (existingItem) {
                existingItem.Quantity = item.Quantity;
            }
        });

        // Save the updated document
        const updatedCardShop = await cardShop.save();

        if (updatedCardShop) {


            res.status(200).send({
                success: true,
                message: "update Thanh Công",

            });


        } else {



            res.status(200).send({
                success: true,
                message: "update That Bai",

            })


        }


    }

    catch (error) {
        res.status(404).send({
            success: false,
            message: error,
        });
    }

});


CardShopRouter.put("/delete/:UserId", async (req, res, next) => {
    try {
        const {
            params: { UserId },
            body: { items }
        } = req;

        const dataOut = await CardShop_Model.findOneAndUpdate(
            { UserId },
            { $pull: { items: { _id: { $in: items } } } },
            { new: true }
        );


        res.status(200).send({
            success: true,
            message: "đã xoas vào giỏ hàng",
            dataOut,
        });
    } catch (error) {
        console.error(error);
        res.status(404).send({
            success: false,
            message: error,
        });
    }
});



module.exports = { route: CardShopRouter, name: "CardShop" };