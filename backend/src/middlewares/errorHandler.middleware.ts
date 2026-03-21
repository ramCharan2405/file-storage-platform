import { ErrorRequestHandler } from "express";
import { HTTPSTATUS } from "src/config/http.config";
import { AppError } from "src/utils/app-error";

export const errorHandler: ErrorRequestHandler = (error, req, res, next) => {
  console.log(`Error occurred on PATH ${req.path}`, {
    body: req.body,
    params: req.params,
    error,
  });

  if (error instanceof SyntaxError && "body" in error) {
    return res.status(HTTPSTATUS.BAD_REQUEST).json({
      message: "Invalid JSON format, please check your request body.",
    });
  }
  if (error instanceof AppError){
    return res.status(error.statusCode).json({
      message: error.message,
      errorCode: error.errorCode,
    });
  }
  return res.status(HTTPSTATUS.INTERNAL_SERVER_ERROR).json({
    message: "Something went wrong",
    error: error.message || 'Unknown error',
  });
};