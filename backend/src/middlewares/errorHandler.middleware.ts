import { ErrorRequestHandler,Response } from "express";
import { HTTPSTATUS } from "../config/http.config";
import { AppError } from "../utils/app-error";
import { logger } from "../utils/logger";
import {ZodError} from "zod";
import { ErrorCodeEnum } from "../enums/error-code.enum";


const formatZodError =(error:ZodError,res:Response) => {
  const errors=error?.issues?.map((err)=>({
    field:err.path.join('.'),
    message:err.message
  }));
  
  return res.status(HTTPSTATUS.BAD_REQUEST).json({
    message: "Validation error",
    errors,
    errorCode: ErrorCodeEnum.VALIDATION_ERROR
  });
}
export const errorHandler: ErrorRequestHandler = (error, req, res, next) => {
  logger.error(`Error occurred on PATH ${req.path}`, {
    body: req.body,
    params: req.params,
    error,
  });

  if (error instanceof SyntaxError && "body" in error) {
    return res.status(HTTPSTATUS.BAD_REQUEST).json({
      message: "Invalid JSON format, please check your request body.",
    });
  }

  if (error instanceof ZodError) {
    return formatZodError(error,res);
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