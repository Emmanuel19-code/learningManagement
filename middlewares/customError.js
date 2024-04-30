//import ErrorHandler from "./errorHandler.js"
//
//export const CustomError = (err, req, res, next) => {
//  let statusCode = "";
//  err.statusCode = statusCode || 500;
//  err.message = err.message || "Internal Server Error";
//
//  if (err.name === "JsonWebTokenError") {
//    const message = "Jwt Error";
//    err = new ErrorHandler(message, 400);
//  }
//
//  if (err.name === "TokenExpiredError") {
//    const message = "Jwt Error";
//    err = new ErrorHandler(message, 400);
//  }
//  res.status(err.statusCode).json({
//    success: false,
//    message: err.message,
//  });
//};
class ErrorHandler extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    Error.captureStackTrace(this, this.constructor);
  }
}

export const customError = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || "Internal Server Error";

  if (err.name === "JsonWebTokenError") {
    const message = "JWT Error";
    err = new ErrorHandler(message, 400);
  }

  if (err.name === "TokenExpiredError") {
    const message = "Token Expired Error";
    err = new ErrorHandler(message, 400);
  }

  res.status(err.statusCode).json({
    success: false,
    message: err.message,
  });
};

export default ErrorHandler;
