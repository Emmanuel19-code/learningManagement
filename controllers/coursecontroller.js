import { StatusCodes } from "http-status-codes";
import { Trycatch } from "../middlewares/trycatch.js";
import course from "../models/courseSchema.js";



export const uploadCourse = Trycatch(
    async(req,res)=>{
        const data = req.body
        const thumbnail = data.thumbnail
        if(thumbnail){
            //cloudinary function goes here
        }
        const createCourse = await course.create(data)
        res.status(StatusCodes.CREATED).json({
            msg:"course has been created"
        })
    }
)