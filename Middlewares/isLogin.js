const activateError = require("../Utils/activateError");

module.exports = (req, res, next) => {
  if (req.session.userID) {
    next();
  } else {
    next(activateError("you are not logged in ...", "faile", 401));
  }
};
