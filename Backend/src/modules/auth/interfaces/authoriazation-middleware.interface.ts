import { NextFunction,Request, Response } from "express";

export interface IAuthorizationMiddleware {
    authorize(...role:string[]):(req:Request, res:Response, next: NextFunction)=>void;
}