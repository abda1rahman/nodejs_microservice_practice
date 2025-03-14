import { CustomError } from "./CustomError";

 export class ValidationError extends CustomError{
    statusCode = 400;
    constructor(message = 'Validation Error'){
        super(message)
        Object.setPrototypeOf(this, ValidationError.prototype);
    }

    serilize(): { message: string; } {
        return {message: this.message}
    }
 }