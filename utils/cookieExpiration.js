import {} from "dotenv/config";

export const createcookies = async ({ res, accesstoken, refreshtoken }) => {
  const oneDay = 1000 * 60 * 60 * 24;
  const longerExp = 1000 * 60 * 60 * 24 * 30;
  const accessTokenOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    signed: true,
    expires: new Date(Date.now() + oneDay),
  };
  const refreshTokenIOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    signed: true,
    expires: new Date(Date.now() + longerExp),
  };
  res.cookie("accessToken", accesstoken, accessTokenOptions);
  res.cookie("refreshToken", refreshtoken, refreshTokenIOptions);
};

export const storeactivatetoken = async ({ res, activationtoken }) => {
  const oneDay = 1000 * 60 * 60 * 24;
  const tokenOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    signed: true,
    expires: new Date(Date.now() + oneDay),
  };
  res.cookie("authcookie", activationtoken, tokenOptions);
};
