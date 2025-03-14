import { AppError } from "../utils/AppError"
import { logger } from "../utils/logger";

export const  errorHandler = (error, req, res, next) => {
    logger.error(error.stack);

    if(error instanceof AppError){
        logger.error('operational error')
        return res.status(error.statusCode).json({success:false, message: error.message});
    }

    return res.status(500).json({message: 'Internal Server Error'})
}