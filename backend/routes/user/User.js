const { Router, query } = require("express");
require('dotenv').config()
const { handleJwt } = require("../../utils/handleJwt");
const bcrypt = require("bcrypt");
const { userMiddleware } = require("./middleware");
const { User_Model } = require("../../models");
const jwt = require('jsonwebtoken');
const userRouter = Router();

userRouter.post("/signup", async (req, res, next) => {
  try {
    const { firstName, lastName, email, password } = req.body;


    // Check if user already exists
    const existingUser = await User_Model.findOne({ email });

    if (existingUser) {
      return res.status(409).send({
        success: false,
        message: "User with this email already exists"
      });
    }
    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);
    // Create new user
    const user = await User_Model.create({ firstName, lastName, email, password: hashed });
    // Generate JWT token
    const token = handleJwt.signToken(user);

    res.status(201).send({
      success: true,
      message: "User successfully created",
      user,
      token,
    });
  } catch (error) {
    res.status(404).send({
      success: false,
      message: error,
    });
  }
});

userRouter.post("/find", async (req, res, next) => {
  try {
    const {
      body: { ListId },
    } = req;

    const query = {}
    if (ListId) {
      query._id = { $in: ListId };
    }

    const users = await User_Model.find(query);


    res.status(200).send({
      success: true,
      message: "Users successfully retrieved",
      users
    });

  }
  catch (error) {
    res.status(404).send({
      success: false,
      message: error,
    });
  }

});

userRouter.post("/login", async (req, res, next) => {
  const {
    body: { email, password },
  } = req;
  try {
    const user = await User_Model.findOne({ email });

    if (user == null) {
      return res.status(200).send({
        success: false,
        message: "Invalid email or password",
      });
    }

    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword || user == null) {
      return res.status(200).send({
        success: false,
        message: "Invalid email or password",
      });
    }
    const token = handleJwt.signToken(user);

    res.status(200).send({
      success: true,
      message: "user successfully",
      user,
      token,
    });

  } catch (error) {
    res.status(404).send({
      success: false,
      message: error,
    });
  }

});


userRouter.post("/veryToken", handleJwt.verifyToken, async (req, res, next) => {
  const {
    body: { token },
  } = req;
  try {
    console.log(token)
    const key = process.env.JWT_SECRET;
    
    const user = jwt.verify(token, key);
    res.status(200).send({
      success: true,
      message: "user successfully retrieved",
      user,
      token,
    });

  } catch (error) {
    res.status(404).send({
      success: false,
      message: error,
    });
  }


});


userRouter.post("/verifyTokenAdmin", handleJwt.verifyTokenAdmin, async (req, res, next) => {
  const {
    body: { token },
  } = req;
  try {
    const key = process.env.JWT_SECRET;
    const user = jwt.verify(token, key);
    console.log(user)
    res.status(200).send({
      success: true,
      message: "user successfully retrieved",
      user,
      token,
    });

  } catch (error) {
    res.status(404).send({
      success: false,
      message: error,
    });
  }


});

userRouter.put(
  "/:id",
  handleJwt.verifyToken,
  userMiddleware.userExists,
  async (req, res, next) => {
    const {
      body,
      params: { id },
      oldUser,
    } = req;

    // Kiểm tra xem id của người dùng trong yêu cầu có trùng khớp với id của oldUser không
    if (id !== oldUser.id) {
      return res.status(403).send({
        success: false,
        message: "You are not authorized to carry out this action",
      });
    }

    try {
      // Cập nhật thông tin người dùng
      const updatedUser = await User_Model.findByIdAndUpdate(
        id,
        {
          firstName: body.firstName || oldUser.firstName,
          lastName: body.lastName || oldUser.lastName,
          password: body.password || oldUser.password,
          email: body.email || oldUser.email,
        },
        { new: true } // Trả về bản ghi đã được cập nhật
      );

      // Kiểm tra nếu không tìm thấy người dùng
      if (!updatedUser) {
        return res.status(404).send({
          success: false,
          message: "User not found",
        });
      }

      // Trả về thông báo thành công cùng với thông tin người dùng đã được cập nhật
      return res.status(200).send({
        success: true,
        message: "User successfully updated",
        user: updatedUser,
      });
    } catch (error) {
      // Xử lý lỗi nếu có
      return res.status(500).send({
        success: false,
        message: "Internal server error",
        error: error.message,
      });
    }
  }
);


module.exports = { route: userRouter, name: "user" };
