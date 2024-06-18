const {User_Model} = require("../../models");

const userMiddleware = {
  userExists: async (req, res, next) => {
    const {
      params: { _id },
    } = req;
    const user = await User_Model.finOne({_id})
    if (!user)
      return res.status(404).send({
        success: true,
        message: "user not found",
        user,
      });

    req.oldUser = user;
    return next();
  },
};

module.exports = { userMiddleware };
