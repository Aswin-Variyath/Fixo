import { NextFunction, Request, Response } from "express";

export interface IAuthMiddleWare {
    authenticate(req:Request, res:Response, next:NextFunction):Promise<void>
}