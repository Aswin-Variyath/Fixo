import type {
  NextFunction,
  Request,
  Response,
} from "express";

import type {
  ZodType,
} from "zod";


export const validateQuery =
  (schema: ZodType) =>
  (
    req: Request,
    _res: Response,
    next: NextFunction
  ): void => {

    const result = schema.safeParse(req.query);

    if (!result.success) {
      next(result.error);
      return;
    }

    next();
  };


export const validateParams =
  (schema: ZodType) =>
  (
    req: Request,
    _res: Response,
    next: NextFunction
  ): void => {

    const result = schema.safeParse(req.params);

    if (!result.success) {
      next(result.error);
      return;
    }

    next();
  };