import { logger } from "../utils/logger";

export const errorHandler = (err, req, res, next) =>{
logger.error(err.stack)

res.status(err.status || 500).json({
    message: err.message || "Internal server error",
})
}

export class AppError extends Error {
    errorCode: any;
    status: any;
    constructor(errorCode, message, statusCode) {
        super(message);
        this.errorCode = errorCode;
        this.status = statusCode;
    }
}
