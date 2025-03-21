import { NextFunction, Request, Response } from "express";
import { logger } from "./logger";

export const asyncHandler = (controller) => async (req, res, next) => {
    try {
        await controller(req, res)
    } catch (error) {
        return next(error)
    }
}