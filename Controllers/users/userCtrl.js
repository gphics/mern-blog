const userModel = require("../../Models/users/userModel.js");
const bcrypt = require("bcryptjs");
const activateError = require("../../Utils/activateError");
const isLogin = require("../../Middlewares/isLogin.js");
const cloud = require("../../Config/cloud.js");
const multer = require("multer");

const upload = multer({ storage: cloud });
// registration route ctrl
const register = async (req, res, next) => {
  const { email, password, fullname } = req.body;
  // check if field is empty
  if (!email || !password || !fullname)
    return next(activateError("all field are required"));
  // ----------
  // ---------
  try {
    // checking if user exist
    const findUser = await userModel.findOne({ email });
    if (findUser) {
      return next(activateError("user already exist"));
    }
    // ------------
    // ------------
    // hashing the password
    // ------------
    const salt = await bcrypt.genSalt(15);
    const hashedPassword = await bcrypt.hash(password, salt);
    // ----------
    // ----------
    // creating user

    const createdUser = await userModel.create({
      fullname,
      password: hashedPassword,
      email,
    });
    res.json({ status: "success", data: createdUser });
  } catch (error) {
    res.json(error);
  }
};

// login route ctrl
const login = async (req, res, next) => {
  const { email, password } = req.body;
  // check if filed is empty
  if (!email || !password) return next(activateError("field is empty"));

  // -----------
  // ------------------
  try {
    // finding the user
    const findUser = await userModel.findOne({ email });
    // if user not found
    if (!findUser) return next(activateError("user not found"));

    // verifying user password
    const verifyPassword = await bcrypt.compare(password, findUser.password);
    //  if password is incorrect
    if (!verifyPassword) return next(activateError("invalid credentials"));

    // if password is correct
    req.session.userID = findUser._id;
    console.log(req.session);
    res.json({ status: "success", data: findUser });
  } catch (error) {
    res.json(error);
  }
};

// fetch user route ctrl
const fetchUser = async (req, res, next) => {
  try {
    const user = await userModel.findById(req.params.id);
    if (user.name === "CastError")
      return next(activateError("user not found ..."));
    res.json({ msg: "welcome to user info from the lord" });
  } catch (error) {
    return next(activateError("user not found ..."));
    // res.json(error);
  }
};

// profile route ctrl
const profile = async (req, res) => {
  try {
    const _id = req.session.userID;
    const user = await userModel.findById(_id).populate("Posts");
    res.json({ msg: user });
  } catch (error) {
    res.json(error);
  }
};

// avatar upload route ctrl
const avatarUpload = async (req, res) => {
  try {
    const user = await userModel.findByIdAndUpdate(
      req.session.userID,
      { avatarUrl: req.file.path },
      { new: true }
    );
    res.json({ msg: "welcome to avatar upload ", user });
  } catch (error) {
    res.json(error);
  }
};
// cover photo route ctrl
const coverPhotoUpload = async (req, res) => {
  try {
 
    const user = await userModel.findByIdAndUpdate(
      req.session.userID,
      { coverImgUrl: req.file.path },
      { new: true }
    );
    res.json({ msg: "welcome to cover photo upload", user });
  } catch (error) {
    res.json(error);
  }
};

// password update route ctrl
const passwordUpdate = async (req, res, next) => {
  const { password } = req.body;
  if (!password) {
    return next(activateError("provide a password"));
  }
  try {
    const salt = await bcrypt.genSalt(15);
    const hashed = await bcrypt.hash(password, salt);
    const updated = await userModel.findByIdAndUpdate(
      req.params.id,
      {
        password: hashed,
      },
      { new: true }
    );
    res.json({ updated });
  } catch (error) {
    res.json(error);
  }
};
// user update route ctrl
const userUpdate = async (req, res, next) => {
  const { fullname, email } = req.body;
  try {
    // checking ...
    //  ---------
    if (email) {
      const checkEmail = await userModel.findOne({ email });
      if (checkEmail) {
        return next(activateError("email already exist ..."));
      }
    }

    // ----------
    // ----------
    const updateUser = await userModel.findByIdAndUpdate(
      req.params.id,
      {
        fullname,
        email,
      },
      { new: true }
    );
    res.json({ updateUser });
  } catch (error) {
    next(activateError(`${error}`));
  }
};
// logout route ctrl
const logout = async (req, res) => {
  try {
    res.json({ msg: "welcome to user logout" });
  } catch (error) {
    res.json(error);
  }
};

module.exports = [
  { url: "/register", method: "post", action: register },
  { url: "/login", method: "post", action: login },
  { url: "/main/:id", method: "get", action: fetchUser },
  { url: "/profile", method: "get", action: profile, mid: [isLogin] },
  { url: "/password-update/:id", method: "put", action: passwordUpdate },
  { url: "/logout", method: "get", action: logout },
  { url: "/user-update/:id", method: "put", action: userUpdate },
  {
    url: "/avatar-upload",
    method: "put",
    action: avatarUpload,
    mid: [upload.single("profile"), isLogin],
  },
  {
    url: "/cover-photo",
    method: "put",
    action: coverPhotoUpload,
    mid: [upload.single("coverPhoto"), isLogin],
  },
];
