import { AppError } from "../utils/AppError";
import { asyncHandler } from "../utils/asyncHandler";
import { logger } from "../utils/logger";
import jwt from 'jsonwebtoken'

export const authenticated = asyncHandler(async (req, res, next) =>{
    const userId = req.headers['x-user-id'];

    if(!userId){
        logger.warn(`Access attempted without user ID`);
        throw new AppError('Authentication required! Please login to continuse', 401)
    }

    req.user = {userId}
    next()
})

