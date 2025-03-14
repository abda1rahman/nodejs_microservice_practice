import { NextFunction, Request, Response } from "express";
import { logger } from "./logger";

export const asyncHandler = (controller) => async (req:Request, res:Response, next:NextFunction) => {
    try {
        await controller(req, res, next);
    } catch (error) {
        logger.error(`Error occure in`, error)
        next(error)
    }
}