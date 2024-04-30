import { StatusCodes } from "http-status-codes";
import { Trycatch } from "../middlewares/trycatch.js";
import courseModel from "../models/courseSchema.js";

export const getAllcourse = Trycatch(async (req, res) => {
  const courses = await courseModel.find();
  //.select("videoUrl suggestions questions links ");
  res.status(StatusCodes.OK).json({
    courses,
  });
});
