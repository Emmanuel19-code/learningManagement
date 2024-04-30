import jwt from "jsonwebtoken";
import { StatusCodes } from "http-status-codes";
import { Trycatch } from "./trycatch.js";

export const Authentication = async (req, res, next) => {
  const { accessToken, refreshToken } = req.signedCookies;
   try {
    if (!accessToken || !refreshToken) {
      return res.json({
        msg: "Please Login into your account",
      });
    }
    const payload = jwt.verify(accessToken, process.env.ACCESS_TOKEN);
    req.user = { uniqueId: payload.uniqueId, username: payload.username,role:payload.role };
    next();
   } catch (error) {
     return res.status(StatusCodes.BAD_REQUEST).json({
       msg:"An error occured while authenticating"
     })
   }
  
}



//export const authorizePermision = Trycatch((...roles)=>(req,res)=> {
//   return async(req,res)=>{
//    if (!roles.includes(req.user.role)) {
//      return res.status(400).json({
//        msg:"not authorized to access this route"
//      })
//    }
//  next();
//   }
//});

export const authorizePermision = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        msg:"You do not have permission to perform this action"
      })
    }
    next();
  };
};

export const verifyuser = Trycatch(async (req, res, next) => {
  const { authcookie } = req.signedCookies;
  if (!authcookie) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      msg: "please make sure you are logged in",
    });
  }
  const payload = jwt.verify(authcookie, process.env.ACTIVATION_TOKEN);
  req.user = { uniqueId: payload.uniqueId };
  next();
});

//const RequestNewPassword = Trycatch(async (req, res, next) => {
//  const { passwordToken } = req.cookies;
//  const payload = jwt.verify(passwordToken, process.env.JWT_SECRET);
//  req.user = { uniqueId: payload.uniqueId, username: payload.username };
//  next();
//});
