import { ErrorRequestHandler, NextFunction, Request, Response } from "express";
import { logger } from "../utils/logger";
import { AppError } from "../utils/AppError";

declare global {
    interface Error {
        isOperational?: boolean;
        statusCode?:number;
    }
}

export const errorHandler: ErrorRequestHandler =  (err:Error, req:Request, res:Response, next: NextFunction):any => {
    logger.error(err.stack)

    if(err instanceof AppError){
        return res.status(err.statusCode).json({success:false, message: err.message})
    }

    return res.status(500).json({
        message: "Internal server error",
    })

}
