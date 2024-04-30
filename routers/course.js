import express from "express";
import {
  askQuestion,
  editcourse,
  getAllcourse,
  getCouseByUser,
  getcourse,
  uploadCourse,
} from "../controllers/coursecontroller.js";
import {
  Authentication,
  authorizePermision,
} from "../middlewares/authentication.js";

const router = express.Router();

router.post(
  "/createcourse",
  Authentication,
  authorizePermision("admin"),
  uploadCourse
);
router.put(
  "/editcourse:course_id",
  Authentication,
  authorizePermision("admin"),
  editcourse
);
router.get("/getcourse", getcourse);
router.get("/allcourse",getAllcourse)
router.get("/enrolledcourse:course_id",Authentication,getCouseByUser)
router.post("/askquestion:course_id",Authentication,askQuestion)

export default router;
