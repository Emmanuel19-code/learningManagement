import { Trycatch } from "../middlewares/trycatch.js";
import user from "../models/usermodel.js";
import storeOTP from "../models/OtpSchema.js";
import { checkPassword } from "../utils/Checkpassword.js";
import {
  createcookies,
  storeactivatetoken,
} from "../utils/cookieExpiration.js";
import { StatusCodes } from "http-status-codes";
import { emailValidation } from "../utils/emailvalidator.js";
import { sendOneTimePassword } from "../utils/MailNotification.js";
import jwt from "jsonwebtoken";
//import redis  from "../databaseConnection/redis.js";

export const registeraccount = Trycatch(async (req, res, next) => {
  const { name, email, password, username } = req.body;
  if (!name || !email || !password || !username) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      msg: "Please Provide the missing detail",
    });
  }
  const valid = emailValidation(email);
  if (!valid) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      msg: "Please provide a valid email",
    });
  }
  const check = checkPassword(password);
  if (!check) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      msg1: "Password must have atleasts an uppercase letter",
      msg2: "Passord must have at least a lowercase letter",
      msg3: "Password must be a minimum of 8 characters",
      msg4: "Passowrd must have the following characters (?=.*[@$!%*#?&])",
    });
  }
  const isUsername = await user.findOne({ username });
  const isEmail = await user.findOne({ email });
  if (isUsername) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      msg: "A user with this username exist",
    });
  }
  if (isEmail) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      msg: "A user with this email exist",
    });
  }
  const userCreated = await user.create(req.body);
  if (!userCreated) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      msg: "Could not create please try again",
    });
  }

  const OTP = await userCreated.createActivationToken();
  const hashotp = await userCreated.HashOtp(OTP.activationcode);
  const createOTP = await storeOTP.create({
    owner: userCreated.uniqueId,
    otpvalue: hashotp.HashedOtp,
  });
  sendOneTimePassword({
    name: userCreated.name,
    email: userCreated.email,
    verificationToken: OTP.activationcode,
  });
  const activationtoken = OTP.activationtoken;
  storeactivatetoken({ res, activationtoken });
  console.log("user controller activationtoken", activationtoken);
  res.status(StatusCodes.CREATED).json({
    msg: "User created",
    otp: OTP.activationcode,
  });
});

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
  //await redis.set("user_id",JSON.stringify(isUser))
  res.status(StatusCodes.OK).json({
    message: "Authentication Successful",
    userInfo: {
      username,
      uniqueId: isUser.uniqueId,
      profilePicture: isUser.profilePicture,
    },
  });
});

export const ForgotPassword = Trycatch(async (req, res) => {
  const { userInfo } = req.body;
  if (!userInfo) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      msg: "field cannot be empty",
    });
  }
  const isUser = await user.findOne({ email: userInfo });
  if (!isUser) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      msg: "User not found",
    });
  }
  const token = isUser.createActivationToken();
  const activationtoken = token.activationtoken;
  storeactivatetoken({ res, activationtoken });
  res.status(StatusCodes.OK).json({
    msg: "ohk",
  });
});

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

export const ChangeProfilePicture = Trycatch(async (req, res) => {
  const { profilePicture } = req.body;
  if (!profilePicture) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      msg: "Please provide the missing field",
    });
  }
  const uniqueId = req.user.uniqueId;
  const isUser = await user.findOne({ uniqueId });
  isUser.profilePicture = profilePicture;
  isUser.save();
  res.status(StatusCodes.OK).json({
    msg: "Your Profile picture has been updated succesffuly",
  });
});

export const LogOut = Trycatch(async (req, res) => {
  res.cookie("accessToken", "", { maxAge: 1 });
  res.cookie("refreshToken", "", { maxAge: 1 });
  res.status(StatusCodes.OK).json({
    msg: "You have been logged out",
  });
});

export const deletellAccount = Trycatch(async (req, res) => {
  const delaccount = await user.deleteMany();
  if (!delaccount) {
    return res.status(400).json({
      msg: "accounts could not be del",
    });
  }
  return res.status(StatusCodes.OK).json({
    msg: "All account have been deleted",
  });
});

export const getAllAccounts = Trycatch(async (req, res) => {
  const allaccount = await user
    .find()
    .select("uniqueId name username email profilePicture isverified ");
  res.status(200).json({
    msg: allaccount,
  });
});

export const updateAccessToken = Trycatch(async (req, res) => {
  const { refreshToken } = req.signedCookies;
  console.log(refreshToken);
  const decode = jwt.verify(refreshToken, process.env.REFRESH_TOKEN);
  if (!decode) {
    return res.status(400).json({
      msg: "Please sign into your account again",
    });
  }

  const accessToken = jwt.sign(
    { uniqueId: decode.uniqueId, username: decode.username, role: decode.role },
    process.env.ACCESS_TOKEN,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    }
  );
  const oneDay = 1000 * 60 * 60 * 24;
  const accessTokenOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    signed: true,
    expires: new Date(Date.now() + oneDay),
  };
  res.cookie("accessToken", accessToken, accessTokenOptions);
  res.status(200).json({
    msg: "successfully updated",
  });
});

export const userprofile = Trycatch(async (req, res) => {
  const userid = req.user.uniqueId;
  if (!userid) {
    return res.status(400).json({
      msg: "please provide your user_id",
    });
  }
  const user_profile = await user.findOne({uniqueId: userid });
  return res.status(200).json({
    data: user_profile,
  });
});

export const updateUserInfo = Trycatch(async (req, res) => {
  const { email, name } = req.body;
  const user_id = req.user.uniqueId;
  if (!user_id) {
    return res.status(400).json({
      msg: "please provide the user id",
    });
  }
  if (!(email && name)) {
    return res.status(400).json({
      msg: "please provide the missing fields",
    });
  }
  const isUser = await user.findOne({ user_id });
  if (!isUser) {
    return res.status(400).json({
      msg: "user does not exist",
    });
  }
  if (isUser.email === email) {
    return res.status(400).json({
      msg: "old and new email cannot be the same",
    });
  }
  if (isUser.name === name) {
    return res.status(400).json({
      msg: "old and new name cannot be the same",
    });
  }
  isUser.email = email;
  isUser.name = name;
  isUser.save();
  res.status(200).json({
    msg: "details successfully updated",
    data: isUser,
  });
});
