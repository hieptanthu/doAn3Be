const mongoose = require('mongoose');

const {Oder_Model,Product_Model} = require("../models");


export async function getOrderWithProductDetails(orderId) {
    try {
      const order = await Order.findById(orderId).populate({
        path: 'Detail.ProductId',
        select: 'Name Img' // Chỉ chọn các trường name và price từ Product
      });
      console.log(order);
      return order;
    } catch (error) {
      console.error('Error fetching order with product details:', error);
    }
  }


  const mongoose = require('mongoose');
  const Order = require('./models/Order'); // Đường dẫn đến mô hình Order
  
  // Kết nối đến MongoDB
  mongoose.connect('mongodb://localhost:27017/ten_cua_database', {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }).then(() => {
    console.log("Connected to MongoDB");
  }).catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });
  
  // Hàm để truy vấn và tính toán giá trị sản phẩm
  async function calculateProductTotal(orderId) {
    try {
      const order = await Order.aggregate([
        { $match: { _id: mongoose.Types.ObjectId(orderId) } }, // Lọc đơn hàng theo ID
        { $unwind: "$Detail" }, // Tách các mục chi tiết thành các tài liệu riêng biệt
        {
          $lookup: {
            from: 'products', // Tên của bảng sản phẩm
            localField: 'Detail.ProductId',
            foreignField: '_id',
            as: 'product'
          }
        },
        { $unwind: "$product" }, // Tách thông tin sản phẩm thành các tài liệu riêng biệt
        {
          $project: {
            _id: 0,
            productName: "$product.name",
            totalPrice: { $multiply: ["$Detail.Quantity", "$Detail.Price"] } // Tính toán tổng giá trị sản phẩm
          }
        }
      ]);
      
      console.log(order);
      return order;
    } catch (error) {
      console.error('Error calculating product total:', error);
    }
  }
  
  // Gọi hàm và truyền vào ID của đơn hàng
  calculateProductTotal('60c72b3e9b1e8a5f8a9b5678'); // Thay thế bằng ID thực tế của đơn hàng
  