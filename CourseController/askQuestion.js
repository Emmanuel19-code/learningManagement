import { StatusCodes } from "http-status-codes";
import { Trycatch } from "../middlewares/trycatch.js";
import courseModel from "../models/courseSchema.js";


export const askQuestion = Trycatch(async (req, res) => {
  const { course_id } = req.params;
  const { question } = req.body;
  if (!question) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      msg: "This field cannot be empty",
    });
  }
  const courseContent = await courseModel.findOne({ course_id });
  res.status(StatusCodes.OK).json({
    courseContent,
  });
});
