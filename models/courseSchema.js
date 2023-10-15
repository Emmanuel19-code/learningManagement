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
  comment: String,
  commentReplies: String,
});

const courseDataSchema = new mongoose.Schema({
  videoUrl: String,
  videoThumbnail: String,
  title: String,
  vidoSection: String,
  description: String,
  videoLenght: Number,
  videoPlayer: String,
  links: [LinkSchema],
  suggestion: String,
  questions: String,
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
  Thumbnail:{
    public_id:{
        type:String,
        required:true
    },
    url:{
        type:String,
        required:true
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

const course = new mongoose.model("course",courseSchema)
export default course