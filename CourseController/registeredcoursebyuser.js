import { StatusCodes } from "http-status-codes";
import { Trycatch } from "../middlewares/trycatch.js";
import user from "../models/usermodel.js";
import courseModel from "../models/courseSchema.js";

export const getCouseByUser = Trycatch(async (req, res) => {
  const { course_id } = req.params;
  const uniqueId = req.user.uniqueId;
  const enrolleduser = await user.findOne({ uniqueId });
  const courseExists = enrolleduser.courses.find(
    (course) => course._id.toString() === course_id
  );
  if (!courseExists) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      msg: "You do not have access to this course",
    });
  }
  const courseContent = await courseModel.findById(course_id);
  const courseDetails = courseContent.coursedata;
  res.status(StatusCodes.OK).json({
    msg: courseDetails,
  });
});
