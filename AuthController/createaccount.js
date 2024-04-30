import { Trycatch } from "../middlewares/trycatch.js";
import user from "../models/usermodel.js";
import storeOTP from "../models/OtpSchema.js";
import { checkPassword } from "../utils/Checkpassword.js";
import {
  storeactivatetoken,
} from "../utils/cookieExpiration.js";
import { StatusCodes } from "http-status-codes";
import { emailValidation } from "../utils/emailvalidator.js";
import { sendOneTimePassword } from "../utils/MailNotification.js";
import cloudinary from "cloudinary"
import ErrorHandler from "../middlewares/customError.js";


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
    //return res.status(StatusCodes.BAD_REQUEST).json({
    //  msg: "A user with this username exist",
    //});
    return next(new ErrorHandler("A user with this username exist", 400));
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