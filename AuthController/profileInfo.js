import { Trycatch } from "../middlewares/trycatch.js";
import user from "../models/usermodel.js";


export const userprofile = Trycatch(async (req, res) => {
  const userid = req.user.uniqueId;
  if (!userid) {
    return res.status(400).json({
      msg: "please provide your user_id",
    });
  }
  const user_profile = await user.findOne({ uniqueId: userid });
  return res.status(200).json({
    data: user_profile,
  });
});
