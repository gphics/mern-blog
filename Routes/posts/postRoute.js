const express = require("express");
const postCtrl = require("../../Controllers/posts/postCtrl");

const postRouter = express.Router();
postCtrl.map(({ url, method, action, mid }) => {
  if (mid) {
    postRouter[method](url,...mid, action);
  } else {
    postRouter[method](url, action);
  }
});

module.exports = postRouter;
