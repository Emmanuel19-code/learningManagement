import { Trycatch } from "../middlewares/trycatch.js";
import user from "../models/usermodel.js";
import storeOTP from "../models/OtpSchema.js";
import { StatusCodes } from "http-status-codes";
import jwt from "jsonwebtoken";


export const activateAccount = Trycatch(async (req, res) => {
  const { activationcode } = req.body;
  const userId = req.user.uniqueId;
  if (!userId) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      msg: "Please this user does not exist",
    });
  }
  if (activationcode.length !== 4) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      msg: "token length must be 4",
    });
  }
  const isUser = await storeOTP.findOne({ owner: userId });
  if (!isUser) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      msg: "Please Request a new OTP",
    });
  }
  const payload = jwt.verify(isUser.otpvalue, process.env.HASH_PASSWORD);
  if (activationcode !== payload.otpvalue) {
    return res.status(400).json({
      msg: "please provide the right OTP value",
    });
  }
  const unverifieduser = await user.findOne({ uniqueId: userId });
  unverifieduser.isverified = true;
  unverifieduser.save();
  const delotp = await storeOTP.deleteOne({ owner: userId });
  res.clearCookie("authcookie");
  res.status(StatusCodes.OK).json({
    msg: "You have been verified successfully",
  });
});
