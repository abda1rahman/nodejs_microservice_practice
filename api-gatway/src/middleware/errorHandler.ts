import { ErrorRequestHandler, NextFunction, Request, Response } from "express";
import { logger } from "../utils/logger";
import { AppError } from "../utils/AppError";


export const errorHandler: ErrorRequestHandler = (
  error,
  req: Request,
  res: Response,
  next: NextFunction
): any => {
  logger.error(error.stack);

    if(error instanceof AppError){
        return res.status(error.statusCode).json({success: false, message: error.message})
    }

  return res.status(error.status || 500).json({
    message: error.message || "Internal server error",
  });
};
