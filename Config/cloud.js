const cloudinary = require("cloudinary").v2;

const { CloudinaryStorage } = require("multer-storage-cloudinary");

cloudinary.config({
  cloud_name: "dtu3jive9",
  api_key: "312329342534745",
  api_secret: "HS2zpixCKN85GIh2jSB5rRb_-80",
});
module.exports = new CloudinaryStorage({
  cloudinary,
  allowedFormats: ["jpg", "png", "jpeg"],
  params: {
    folder: "/hi-blog",
    transformation: [{ width: 400, height: 400, crop: "limit" }],
  },
});
