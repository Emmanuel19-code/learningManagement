import { Trycatch } from "../middlewares/trycatch.js";
import { StatusCodes } from "http-status-codes";



export const LogOut = Trycatch(async (req, res) => {
  res.cookie("accessToken", "", { maxAge: 1 });
  res.cookie("refreshToken", "", { maxAge: 1 });
  res.status(StatusCodes.OK).json({
    msg: "You have been logged out",
  });
});
