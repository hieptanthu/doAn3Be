const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema(
  {
    ProductId: mongoose.Schema.Types.ObjectId ,
    UserId:{ type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    Image:[String],
    UserName:String,
    CommentText:String,
    star:Number
  }
  ,
  {
    timestamps: true
  }
);

const Comment = mongoose.model("Comment", CommentSchema);

module.exports = Comment;
