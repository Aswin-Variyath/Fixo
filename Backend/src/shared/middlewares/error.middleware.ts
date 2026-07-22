import { NextFunction, Response, Request } from "express";


export const errorMiddleWare = (error: Error, req: Request, res: Response, next: NextFunction):void => {
  res.status(500).json({
    success:false,
    message: "Internal server error"
  })
}