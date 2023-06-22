const cloud = require("../../Config/cloud");
const isLogin = require("../../Middlewares/isLogin");
const PostModel = require("../../Models/posts/PostModel");
const userModel = require("../../Models/users/userModel");
const multer = require("multer");
const activateError = require("../../Utils/activateError");
const isOwner = require("../../Middlewares/isOwner");

const upload = multer({ storage: cloud });
// create post route ctrl
const create = async (req, res, next) => {
  const { title, description, category } = req.body;
  try {
    if (!title || !description || !category || !req.file.path) {
      return next(activateError("no field must be empty", "failed", 404));
    }
    const userID = req.session.userID;
    const userFound = await userModel.findById(userID);

    const postCreated = await PostModel.create({
      title,
      description,
      author: userID,
      category,
      img: req.file.path,
    });
    userFound.Posts.push(postCreated._id);
    const updatedUser = await userFound.save();
    res.json({ postCreated });
  } catch (error) {
    res.json(error);
  }
};
// fetch all post route ctrl
const fetchAllPost = async (req, res) => {
  try {
    const allPost = await PostModel.find().populate("comments");
    res.json({ allPost });
  } catch (error) {
    res.json(error);
  }
};
// fetch single post route ctrl
const fetchSinglePost = async (req, res, next) => {
  const { id } = req.params;
  try {
    const post = await PostModel.findById(id);

    res.json({ post });
  } catch (error) {
    return next(activateError(error.message));
  }
};
/*
// delete post route ctrl
const deletePost = async (req, res, next) => {
  try {
    const user = await userModel.findById(req.session.userID);
    const deletedPost = await PostModel.findByIdAndDelete(req.params.id);
    user.Posts.filter((id) => id !== req.params.id);
    await user.save();
    res.json({ data: " post deleted successfully ....." });
  } catch (error) {
    return next(activateError(error.message));
  }
};
*/
const deletePost = async (req, res, next) => {
  try {
    const user = await userModel.findById(req.session.userID);
    const deletedPost = await PostModel.findByIdAndDelete(req.params.id);
    user.Posts.filter((id) => id.toString() !== req.params.id);
    await user.save();
    res.json({ data: " post deleted successfully ....." });
  } catch (error) {
    return next(activateError(error.message));
  }
};
// update post route ctrl
const updatePost = async (req, res, next) => {
  const { id } = req.params;

  try {
    const post = await PostModel.findByIdAndUpdate(id, req.body, { new: true });

    res.json({ post });
  } catch (error) {
    return next(activateError(error.message));
  }
};

module.exports = [
  {
    url: "/create",
    method: "post",
    action: create,
    mid: [isLogin, upload.single("postImg")],
  },
  { url: "/all", method: "get", action: fetchAllPost },
  { url: "/:id", method: "get", action: fetchSinglePost },
  {
    url: "/delete/:id",
    method: "delete",
    action: deletePost,
    mid: [isLogin, isOwner],
  },
  {
    url: "/update/:id",
    method: "put",
    action: updatePost,
    mid: [isLogin, isOwner],
  },
];
