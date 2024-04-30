import { Trycatch } from "./middlewares/trycatch.js";
import user from "./models/usermodel.js";
import { StatusCodes } from "http-status-codes";

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
