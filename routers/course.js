import express from "express"
import { uploadCourse } from "../controllers/coursecontroller.js";
import { Authentication, authorizePermision } from "../middlewares/authentication.js";


const router = express.Router();


//router.post("/createcourse",Authentication,authorizePermision("admin"),uploadCourse)


export default router