import { CustomError } from "./CustomError";

export class AuthenticationError extends CustomError{
    statusCode = 401

    constructor(message = 'AuthError'){
        super(message)
        Object.setPrototypeOf(this, AuthenticationError.prototype);
    }

    serilize(): { message: string; } {
        return {message: this.message}
    }
}