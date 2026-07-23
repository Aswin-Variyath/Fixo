import { NextFunction, Response, Request} from "express";
import { success, ZodType } from "zod";

export const validate = (schema: ZodType)=>{
  return (req:Request, res: Response, next: NextFunction):void=> {
    console.log("daf", req.body)
    const result = schema.safeParse({
      body: req.body,
      query: req.query,
      params: req.params
    })
    if(!result.success) {
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
    next()
  }
}