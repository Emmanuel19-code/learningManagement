import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import { connection } from "./databaseConnection/connection.js"
import {} from "dotenv/config"
//import { CustomError } from "./middlewares/customError.js"
import userRoute from "./routers/user.js"
import courseRouter from "./routers/course.js"
import cloudinary from "./databaseConnection/cloudinary.js"
import ErrorHandler from "./middlewares/customError.js"

const app = express()




app.use(cors())
app.use(express.json({limit:"50mb"}))
app.use(cookieParser(process.env.COOKIE_PARSER_SECRET));


app.use("/api/v1/users",userRoute)
app.use("/api/v1/course",courseRouter)









connection()
cloudinary
//app.use(CustomError)
app.use(ErrorHandler)
app.listen(`${process.env.PORT}`,()=>{
    console.log(`server running ${process.env.PORT} 🚀🚀`);
})