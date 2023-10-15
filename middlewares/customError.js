import { ErrorHandler } from "./errorHandler.js";

export const customError = (err,req,res,next)=>{
    let message,statusCode =''
    err.statusCode = statusCode || 500
    err.message = err.message || "Internal Server Error"

    //expiredToken
    if(err.name = "ExpiredToken"){
        const message = "Token is expired"
        err = new ErrorHandler(message,400)
    }
    res.status(err.statusCode).json({
        success:false,
        message:err.message
    })
}