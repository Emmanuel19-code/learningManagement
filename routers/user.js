import express from "express";
import {
  ForgotPassword,
  activateAccount,
  createNewPassword,
  deletellAccount,
  getAllAccounts,
  login,
  registeraccount,
  updateAccessToken,
  updateUserInfo,
  userprofile,
} from "../controllers/userscontroller.js";
import { Authentication, verifyuser } from "../middlewares/authentication.js";
const router = express.Router();

router.post("/registration", registeraccount);
router.post("/activate_account",verifyuser, activateAccount);
router.post("/login", login);
router.delete("/allaccount", deletellAccount);
router.get("/allaccount", getAllAccounts);
router.post("/forgotpassword",ForgotPassword)
router.post("/newpassword",verifyuser,createNewPassword)
router.get("/updateacesstoken",updateAccessToken)
router.get("/userInfo",Authentication,userprofile)

export default router;
