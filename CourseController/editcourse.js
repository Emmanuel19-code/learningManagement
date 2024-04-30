import { StatusCodes } from "http-status-codes";
import { Trycatch } from "../middlewares/trycatch.js";
import { create_data, delete_data } from "../utils/cloudinary.js";
import courseModel from "../models/courseSchema.js";

export const editcourse = Trycatch(async (req, res) => {
  const data = req.body;
  const course_id = req.params.course_id;
  const thumbnail = data.thumbnail;
  if (thumbnail) {
    delete_data(thumbnail);
    const mycloud = create_data(thumbnail, course);
    data.thumbnail = {
      public_id: mycloud.public_id,
      url: mycloud.secure_url,
    };
  }
  const course = await courseModel.findByIdAndUpdate(
    course_id,
    {
      $set: data,
    },
    { new: true }
  );
  res.status(StatusCodes.OK).json({
    msg: "course has successfully been updated",
  });
});
