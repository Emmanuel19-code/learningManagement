import { Trycatch } from "../middlewares/trycatch.js";
import user from "../models/usermodel.js";
import { StatusCodes } from "http-status-codes";


export const createNewPassword = Trycatch(async (req, res) => {
  const { newpassword } = req.body;
  const uniqueId = req.user.uniqueId;
  if (!newpassword) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      msg: "field cannot be empty",
    });
  }
  const isUser = await user.findOne({ uniqueId });
  const isMatch = await isUser.comparePassword(newpassword);
  if (isMatch) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      msg: "New password and old cannot be the same",
    });
  }
  isUser.password = newpassword;
  isUser.save();
  res.clearCookie("authcookie");
  res.status(StatusCodes.CREATED).json({
    msg: "Password has been updated successfully",
  });
});
