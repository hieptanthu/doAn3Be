const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema(
  {
    UserId:{ type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    MessageText:String,
    Status:Number,
  }
);

const Message = mongoose.model("Message", MessageSchema);

module.exports = Message;
