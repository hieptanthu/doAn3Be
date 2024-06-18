const { Router } = require("express");
const { Comment_Model } = require("../../models");
const CommentRouter = Router();
const upload = require("../../tool/creactlink");

CommentRouter.get("/:ProductId", async (req, res, next) => {
  try {

    const {
      params: { ProductId,Page,PageSize },
    } = req;

    const page = Page ||1; // You can get this value from request query parameters
    const limit =PageSize ||10; // You can get this value from request query parameters

    const skip = (page - 1) * limit;

    // Thực hiện truy vấn một cách tối ưu
    const [sd, totalItems] = await Promise.all([
      Comment_Model.find({ ProductId }).skip(skip).limit(limit).populate({
        path: 'UserId',
        select: '_id firstName lastName'}).sort({createdAt:-1}),
      Comment_Model.countDocuments({ ProductId })
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
      message: "Comment successfully retrieved",
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



CommentRouter.post("/:ProductId", upload.array('files', 4), async (req, res, next) => {
  try {


    const {
      body: { UserId, UserName, CommentText, star },
      params: { ProductId }
    } = req;

   
    const datain = { ProductId, UserId, UserName, CommentText, star }
    if (req.files) {
      datain.Image = req.files.map(file => file.path);
    }

   

    console.log(datain)
    const  dataOut = await Comment_Model.create(datain)
    if(dataOut.Image.length>0){
      const serverAddress = req.protocol + '://' + req.get('host');
      dataOut.Image= dataOut.Image.map(image => serverAddress + "/" + image);
    }
    



    res.status(200).send({
      success: true,
      message: "Comment successfully create",
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


CommentRouter.put("/:_id", upload.array('files', 4), async (req, res, next) => {
  try {



    const {
      body: { CommentText, star },
      params: { _id }
    } = req;


    

    const datain = { CommentText, star }


    const dataOut = await Comment_Model.findByIdAndUpdate(_id,datain)

   


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
      message: "Comment successfully  put",
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





CommentRouter.delete("/:_id", async (req, res, next) => {
  try {
    const {
      params: { _id },


    } = req;
    const dataOut = await Comment_Model.findByIdAndDelete(_id)


    res.status(200).send({
      success: true,
      message: "Comment successfully delete",
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


module.exports = { route: CommentRouter, name: "Comment" };