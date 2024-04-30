import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";

const reviewSchema = new mongoose.Schema({
  user: {
    type: String,
  },
  rating: {
    type: Number,
  },
  comment: String,
});

const LinkSchema = new mongoose.Schema({
  title: String,
  url: String,
});

const commentSchema = new mongoose.Schema({
  user: String,
  question: String,
  questionReplies: [Object],
});

const courseDataSchema = new mongoose.Schema({
  videoUrl: String,
  videoThumbnail: String,
  title: String,
  vidoSection: String,
  description: String,
  videoLength: Number,
  videoPlayer: String,
  links: [LinkSchema],
  suggestion: String,
  questions: [commentSchema],
});

const courseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "please provide this field"],
  },
  description: {
    type: String,
    required:true
  },
  price:{
    type:Number,
    required:true
  },
  estimatedPrice:{
    Number
  },
  thumbnail:{
    public_id:{
        type:String,
       // required:true
    },
    url:{
        type:String,
        //required:true
    }
  },
  tags:{
    type:String,
    required:true
  },
  level:{
    type:String,
    required:true
  },
  demourl:{
    type:String,
    required:true
  },
  benefits:[{title:String}],
  prerequisites:[{title:String}],
  reviews:[reviewSchema],
  coursedata:[courseDataSchema],
  ratings:{
    type:Number,
    default:0
  },
  purchased:{
    type:Number,
    default:0
  }
});

const courseModel = new mongoose.model("course",courseSchema)
export default courseModel