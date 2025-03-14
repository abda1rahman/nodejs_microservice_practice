
export class AppError extends Error {
    statusCode: number;
    constructor(message, statusCode){
        super(message)
        this.statusCode = statusCode
        Error.captureStackTrace(this, this.constructor)
        Object.setPrototypeOf(this, AppError.prototype)
    }
}