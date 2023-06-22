const express = require("express");
const commentCtrl = require("../../Controllers/comments/commentCtrl");

const commentRouter = express.Router();

commentCtrl.map(({ url, action, method, mid }) => {
  if (mid) {
    commentRouter[method](url,...mid, action);
  } else {
    commentRouter[method](url, action);
  }
  
});
module.exports = commentRouter;
