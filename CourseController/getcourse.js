import { StatusCodes } from "http-status-codes";
import { Trycatch } from "../middlewares/trycatch.js";
import courseModel from "../models/courseSchema.js";

export const getcourse = Trycatch(async (req, res) => {
  const { course_id } = req.params.course_id;
  const coursedetails = await courseModel
    .findById(course_id)
    .select("videoUrl suggestions questions links ");
  res.status(StatusCodes.OK).json({
    coursedetails,
  });
});
