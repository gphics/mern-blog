const isLogin = require("../../Middlewares/isLogin");
const CommentModel = require("../../Models/comments/CommentModel");
const PostModel = require("../../Models/posts/PostModel");
const userModel = require("../../Models/users/userModel");

// create comment route ctrl
const create = async (req, res) => {
  try {
    const post = await PostModel.findById(req.params.id);
    const comment = await CommentModel.create({
      user: req.session.userID,
      message: req.body.message,
    });

    await post.save()
    const user = await userModel.findById(req.session.userID)
    user.comments.push(comment._id)
    await user.save()
    res.json({comment, user, post})
  } catch (error) {
    res.json(error);
  }
};
// fetch single comment route ctrl
const fetchSingleComment = async (req, res) => {
  try {
    const comment = await CommentModel.findById(req.params.id)
    res.json(comment)
  } catch (error) {
    res.json(error);
  }
};
// delete comment route ctrl
const deleteComment = async (req, res) => {
  try {
    const deletedComment = await CommentModel.findByIdAndDelete(req.params.id)
    res.json({deletedComment})
  } catch (error) {
    res.json(error);
  }
};
// update comment route ctrl
const updateComment = async (req, res) => {
  try {
    const comment = await CommentModel.findByIdAndUpdate(req.params.id, req.body, { new: true })
    res.json({comment})
  } catch (error) {
    res.json(error);
  }
};

module.exports = [
  { url: "/create/:id", method: "post", action: create, mid: [isLogin] },
  { url: "/:id", method: "get", action: fetchSingleComment },
  { url: "/delete/:id", method: "delete", action: deleteComment },
  { url: "/update/:id", method: "put", action: updateComment },
];
