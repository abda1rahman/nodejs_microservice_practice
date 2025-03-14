import { CustomError } from "./CustomError";

export class BadRequestError extends CustomError {
    statusCode = 400;
    
    constructor(message = "Bad Request Error"){
        super(message)
        Object.setPrototypeOf(this, BadRequestError.prototype)
    }
    
    serilize(): { message: string; } {
        return {message: this.message}
    }
}