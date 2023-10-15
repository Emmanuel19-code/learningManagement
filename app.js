import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import { connection } from "./databaseConnection/connection.js"
import {} from "dotenv/config"
import { customError } from "./middlewares/customError.js"
import userRoute from "./routers/user.js"
import courseRouter from "./routers/course.js"



const app = express()

app.use(cors())
app.use(cookieParser(process.env.COOKIE_PARSER_SECRET));
app.use(express.json())


app.use("/api/v1/users",userRoute)
app.use("/api/v1/course",courseRouter)









connection()
//app.use(customError)
app.listen(`${process.env.PORT}`,()=>{
    console.log(`server running ${process.env.PORT} 🚀🚀`);
})