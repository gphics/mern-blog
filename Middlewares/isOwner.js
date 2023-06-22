const PostModel = require("../Models/posts/PostModel");
const userModel = require("../Models/users/userModel");
const activateError = require("../Utils/activateError");

module.exports = async (req, res, next) => {
  try {
    const { userID } = req.session;
    const { id } = req.params;

    const entity = await PostModel.findById(id);
    if (entity.author.toString() !== userID.toString())
      return next(activateError("unathorized action ..", "unauthorized", 403));
    next();
  } catch (error) {}
};
