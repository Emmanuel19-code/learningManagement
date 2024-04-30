import { Trycatch } from "../middlewares/trycatch.js";
import user from "../models/usermodel.js";


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
