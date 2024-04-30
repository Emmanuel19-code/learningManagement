import { Trycatch } from "../middlewares/trycatch.js";
import user from "../models/usermodel.js";
import {
  createcookies,
} from "../utils/cookieExpiration.js";
import { StatusCodes } from "http-status-codes";


export const login = Trycatch(async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      msg: "Please provide the information",
    });
  }
  const isUser = await user.findOne({ username });
  if (!isUser) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      msg: "User is not found",
    });
  }
  if (isUser.isverified !== true) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      msg: "Please verify your account",
    });
  }
  const isMatch = await isUser.comparePassword(password);
  if (!isMatch) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      msg: "Please provide the correct details",
    });
  }
  const accesstoken = isUser.createAccessToken();
  const refreshtoken = isUser.createRefreshToken();
  createcookies({ res, accesstoken, refreshtoken });
  res.status(StatusCodes.OK).json({
    message: "Authentication Successful",
    userInfo: {
      username,
      uniqueId: isUser.uniqueId,
      profilePicture: isUser.profilePicture,
    },
  });
});
