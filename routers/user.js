import express from "express";
import {
  deletellAccount,
  getAllAccounts,
} from "../testingcontroller.js";
import { Authentication, verifyuser } from "../middlewares/authentication.js";
const router = express.Router();
import {registeraccount} from "../AuthController/createaccount.js"
import {activateAccount} from "../AuthController/activateaccount.js"
import {login} from "../AuthController/loginaccount.js"
import {ForgotPassword} from "../AuthController/Forgotpassword.js"
import { createNewPassword } from "../AuthController/newpassword.js";
import {updateAccessToken} from "../AuthController/refreshtoken.js"
import { ChangeProfilePicture } from "../AuthController/changeprofilepicture.js";
import { userprofile } from "../AuthController/profileInfo.js";

router.post("/registration", registeraccount);
router.post("/activate_account", verifyuser, activateAccount);
router.post("/login", login);
router.delete("/allaccount", deletellAccount);
router.get("/allaccount", getAllAccounts);
router.post("/forgotpassword", ForgotPassword);
router.post("/newpassword", verifyuser, createNewPassword);
router.get("/updateacesstoken", updateAccessToken);
router.get("/userInfo", Authentication, userprofile);
router.post("/changeprofilepicture", Authentication, ChangeProfilePicture);

export default router;
