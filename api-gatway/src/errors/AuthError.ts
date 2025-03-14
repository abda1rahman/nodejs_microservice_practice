import { CustomError } from "./CustomError"

export class AuthError extends CustomError {
    statusCode = 401;
    constructor(){
        super('user unauthenticated')
        Object.setPrototypeOf(this, AuthError.prototype)
    }

    serialize(): { success: boolean; message: string; } {
        return {success: false, message: 'User Unauthenticated'}
    }
}