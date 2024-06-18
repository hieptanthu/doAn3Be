const mongoose = require("mongoose");;

const ReplyCommentSchema = new mongoose.Schema(
  {
    CommentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Comment' },
    UserId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    Image: [String],
    CommentText: String,

  },
  {
    timestamps: true
  }
);
const ReplyComment = mongoose.model("ReplyComment", ReplyCommentSchema);

module.exports = ReplyComment;
