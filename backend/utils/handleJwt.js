const jwt = require("jsonwebtoken");
require('dotenv').config()
const secretKey = process.env.JWT_SECRET;
const handleJwt = {
  signToken: (data) => {
    try {

      const payload={
        user:data
      }
      const token = jwt.sign(payload, secretKey);
      return token;
    } catch (error) {
      console.log({ error });
      throw new Error("There was a problem verifying your token", error);
    }
  },

  verifyToken: (req, res, next) => {
    try {
      const BearerToken = req.headers.authorization;
      const token = BearerToken.split(" ")[1];
      const user = jwt.verify(token, secretKey);
      req.user = user;
      return next();
    } catch (error) {
      res.status(500).send({
        success: false,
        message: "there was a problem decoding the token",
        error,
      });
    }
  },

  verifyTokenAdmin: (req, res, next) => {
    try {
      const BearerToken = req.headers.authorization;
      const token = BearerToken.split(" ")[1];
      const user = jwt.verify(token, secretKey);
     const userOut =  user.user;
      if(userOut.type==0){
        return next();
      }else{
        res.status(500).send({
          success: false,
          message: "You Not Admin",
          error,
        });
      }
     
    } catch (error) {
      res.status(500).send({
        success: false,
        message: "there was a problem decoding the token",
        error,
      });
    }
  },



};

module.exports = { handleJwt };
