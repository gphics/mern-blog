const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    fullname: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    }, 
    password: {
      type: String,
      required: true,
    },
    avatarUrl: {
      type: String,
      
    },
    coverImgUrl: {
      type: String,
    },
    Posts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }],
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", schema);
