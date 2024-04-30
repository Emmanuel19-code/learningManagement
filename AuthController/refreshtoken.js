import { Trycatch } from "../middlewares/trycatch.js";
import jwt from "jsonwebtoken";


export const updateAccessToken = Trycatch(async (req, res) => {
  const { refreshToken } = req.signedCookies;
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
