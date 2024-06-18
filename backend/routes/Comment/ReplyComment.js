const { Router } = require("express");
const { ReplyComment_Model } = require("../../models");
const ReplyCommentRouter = Router();
const upload = require("../../tool/creactlink");

ReplyCommentRouter.get("/:CommentId", async (req, res, next) => {
  try {

    const {
      params: { CommentId,Page,PageSize },
    } = req;

    const page = Page ||1; // You can get this value from request query parameters
    const limit =PageSize ||10; // You can get this value from request query parameters

    const skip = (page - 1) * limit;

    // Thực hiện truy vấn một cách tối ưu
    const [sd, totalItems] = await Promise.all([
      ReplyComment_Model.find({ CommentId }).skip(skip).limit(limit).populate({
        path: 'UserId',
        select: '_id firstName lastName'}),
      ReplyComment_Model.countDocuments({ CommentId })
    ]);
    const dataOut = Array.from(sd);

    const totalPages = Math.ceil(totalItems / limit);

    // Kiểm tra dataOut có tồn tại và có phần tử không rỗng
    if (dataOut && dataOut.length > 0) {
      // Lấy địa chỉ server
      const serverAddress = req.protocol + '://' + req.get('host');

      // Sử dụng map thay vì forEach để tối ưu hóa
      dataOut.forEach(item => {
        const images = item.Image;
        // Kiểm tra và cập nhật đường dẫn ảnh
        if (images && Array.isArray(images)) {
          item.Image = images.map(image => serverAddress + "/" + image);
        }
      });
    }









    res.status(200).send({
      success: true,
      message: "ReplyComment successfully retrieved",
      dataOut,
      page: page,
      totalPages: totalPages,
      totalItems: totalItems


    });

  }
  catch (error) {
    res.status(404).send({
      success: false,
      message: error,
    });
  }

});



ReplyCommentRouter.post("/:CommentId", upload.array('files', 4), async (req, res, next) => {
  try {


    const {
      body: { UserId,  CommentText },
      params: { CommentId }
    } = req;

   
    const datain = { CommentId, UserId,  CommentText }
    if (req.files) {
      datain.Image = req.files.map(file => file.path);
    }
    console.log(datain)

   

    const  dataOut = await ReplyComment_Model.create(datain)
    if(dataOut.Image.length>0){
      const serverAddress = req.protocol + '://' + req.get('host');
      dataOut.Image= dataOut.Image.map(image => serverAddress + "/" + image);
    }
    



    res.status(200).send({
      success: true,
      message: "ReplyComment successfully create",
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


ReplyCommentRouter.put("/:_id", upload.array('files', 4), async (req, res, next) => {
  try {



    const {
      body: { CommentText, star },
      params: { _id }
    } = req;


    

    const datain = { CommentText, star }


    const dataOut = await ReplyComment_Model.findByIdAndUpdate(_id,datain)

   


    if (dataOut && dataOut.length > 0) {
      const serverAddress = req.protocol + '://' + req.get('host');
      dataOut.forEach(item => {
        const images = item.Image;
        if (images && Array.isArray(images)) {
          item.Image = images.map(image => serverAddress + "/" + image);
        }
      });




    }


    res.status(200).send({
      success: true,
      message: "ReplyComment successfully  put",
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





ReplyCommentRouter.delete("/:_id", async (req, res, next) => {
  try {
    const {
      params: { _id },


    } = req;
    const dataOut = await ReplyComment_Model.findByIdAndDelete(_id)


    res.status(200).send({
      success: true,
      message: "ReplyComment successfully delete",
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


module.exports = { route: ReplyCommentRouter, name: "ReplyComment" };