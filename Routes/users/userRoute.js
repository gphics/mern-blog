const express = require("express");
const userCtrl = require("../../Controllers/users/userCtrl");

const userRouter = express.Router();
// looping through the ctrl objects

userCtrl.map(({ url, method, action, mid }) => {
  if (mid) {
    userRouter[method](url, ...mid, action);
  } else {
    userRouter[method](url, action);
  }
});

module.exports = userRouter;
