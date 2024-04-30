import { Trycatch } from "../middlewares/trycatch.js";
import user from "../models/usermodel.js";
import { StatusCodes } from "http-status-codes";
import cloudinary from "cloudinary";
import { delete_data } from "../utils/cloudinary.js";


export const ChangeProfilePicture = Trycatch(async (req, res) => {
  const { profilePicture } = req.body;
  if (!profilePicture) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      msg: "Please provide the missing field",
    });
  }
  const uniqueId = req.user.uniqueId;
  const isUser = await user.findOne({ uniqueId: uniqueId });
  //console.log(isUser.avatar.public_id);
  if (isUser?.avatar?.public_id) {
    const public_id = isUser.avatar.public_id;
    console.log(public_id);
    //await cloudinary.v2.uploader.destroy(user.avatar.public_id)
    const done = await delete_data(public_id);
    console.log("this is ", done);
    const cloudImage = await cloudinary.v2.uploader.upload(profilePicture, {
      folder: "profilePictures",
      width: 150,
    });
    console.log("upload image", cloudImage);
    if (cloudImage) {
      isUser.avatar = {
        public_id: cloudImage.public_id,
        url: cloudImage.secure_url,
      };
    }
    isUser.avatar = {
      public_id: "",
      url: "",
    };
  } else {
    const cloudImage = await cloudinary.v2.uploader.upload(profilePicture, {
      folder: "profilePictures",
      width: 150,
    });
    isUser.avatar = {
      public_id: cloudImage.public_id,
      url: cloudImage.secure_url,
    };
  }
  await isUser.save();
  res.status(StatusCodes.OK).json({
    msg: "Your Profile picture has been updated succesffuly",
  });
});
