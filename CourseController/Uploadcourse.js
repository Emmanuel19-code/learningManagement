import { StatusCodes } from "http-status-codes";
import { Trycatch } from "../middlewares/trycatch.js";
import courseModel from "../models/courseSchema.js";

export const uploadCourse = Trycatch(async (req, res) => {
  const data = req.body;
  //    const thumbnail = data.thumbnail
  // if(thumbnail){
  //     //cloudinary function goes here
  //     const mycloud = await cloudinary.v2.uploader.upload(thumbnail,{
  //         folder:"courses"
  //     })
  //     data.thumbnail = {
  //         public_id : mycloud.public_id,
  //         url : mycloud.secure_url
  //     }
  // }
  const createCourse = await courseModel.create(data);
  res.status(StatusCodes.CREATED).json({
    msg: "course has been created",
  });
});
