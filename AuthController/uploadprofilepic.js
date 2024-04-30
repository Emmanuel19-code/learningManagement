import { Trycatch } from "../middlewares/trycatch.js";
import cloudinary from "cloudinary";


export const uploadProfilePicture = Trycatch(async (req, res) => {
  const { profilePicture } = req.body;
  const cloudImage = await cloudinary.v2.uploader.upload(profilePicture, {
    folder: "profilePictures",
    width: 150,
  });
  isUser.avatar = {
    public_id: cloudImage.public_id,
    url: cloudImage.secure_url,
  };
});
