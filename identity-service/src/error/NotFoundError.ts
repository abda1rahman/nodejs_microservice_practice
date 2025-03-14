import { CustomError } from "./CustomError";

export class NotFoundError extends CustomError{
    statusCode: 404;

    constructor(message = 'Not Found'){
        super(message)
        Object.setPrototypeOf(this, NotFoundError.prototype);
    }
    serilize(): { success: boolean; message: string; } {
        return{
            success: false,
            message: this.message
        }
    }
}