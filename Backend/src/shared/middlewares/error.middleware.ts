import { NextFunction, Response, Request } from "express";
import { ConflictError } from "../errors/conflict.error";

export const errorMiddleware = (error:Error, req:Request, res:Response, next: NextFunction):void => {
  if(error instanceof ConflictError) {
    res.status(error.statusCode).json({
      success:false,
      message: error.message
    })
    return
  }
  console.log(error)
  res.status(500).json({
    success:false,
    message: "Internal server error"
  })
}