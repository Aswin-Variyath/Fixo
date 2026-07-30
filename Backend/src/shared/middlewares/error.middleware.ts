import { NextFunction, Response, Request } from "express";
import { ConflictError } from "../errors/conflict.error";
import { UnauthorizedError } from "../errors/unauthorized.error";
import { ForbiddenError } from "../errors/forbidden.error";
import { TooManyRequestError } from "../errors/too-many-requests.error";

export const errorMiddleware = (error:Error, req:Request, res:Response, next: NextFunction):void => {
  if(error instanceof ConflictError || error instanceof UnauthorizedError || error instanceof ForbiddenError || error instanceof TooManyRequestError) {
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