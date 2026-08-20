import { NextFunction, Response, Request} from "express";
import {  ZodType } from "zod";


export const validate = (schema: ZodType)=>{
  return (req:Request, res: Response, next: NextFunction):void=> {

    const result = schema.safeParse({
      body: req.body,
      query: req.query,
      params: req.params
    })
    console.log("THisis asdfjasldflaskdflk",result)
    if(!result.success) {
      console.log("After error")
      res.status(400).json({
        success:false,
        message: "Validation failed",
        errors: result.error.issues.map((issue)=>({
          field: issue.path.join("."),
          message:issue.message
        }))
      })
      return
    }
    console.log("Not passed")
    next()
  }
}