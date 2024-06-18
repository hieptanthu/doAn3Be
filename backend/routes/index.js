const userRoute = require("./user/user");

const categoryRoute = require("./category");
const TrademarkRoute = require("./Trademark");
const ProductRoute = require("./Product");
const {SildeRouter,TrendingItemRouter} = require("./Home");

const CardShopRoute = require("./CardShop");
const OderRoute= require("./Oder");

const CommentRoute= require("./Comment");

const ReplyCommentRoute= require("./Comment/ReplyComment");
const ProductSpecificationsRoute= require("./ProductSpecifications");
const BlogRoute= require("./Blog");










const allRoutes = [userRoute,categoryRoute,SildeRouter,TrademarkRoute,ProductRoute,TrendingItemRouter,CardShopRoute,OderRoute,CommentRoute,ProductSpecificationsRoute,ReplyCommentRoute,BlogRoute];

const initializeRoutes = (app) => {
  allRoutes.forEach((router) => {
    app.use(`/api/v1/${router.name}`, router.route);
  });
  return app;
};

module.exports = { initializeRoutes };
