import { ErrorRequestHandler, NextFunction, Request, Response } from "express";
import { logger } from "../utils/logger";
import { DatabaseError } from "../errors/DatabaseError";
import { AuthError } from "../errors/AuthError";
import { BadRequestError } from "../errors/BadRequestError";
import { CustomError } from "../errors/CustomError";

export const errorHandler: ErrorRequestHandler = (
  error,
  req: Request,
  res: Response,
  next: NextFunction
): any => {
  logger.error(error.stack);

    if(error instanceof CustomError){
        return res.status(error.statusCode).json(error.serialize())
    }

  return res.status(error.status || 500).json({
    message: error.message || "Internal server error",
  });
};
