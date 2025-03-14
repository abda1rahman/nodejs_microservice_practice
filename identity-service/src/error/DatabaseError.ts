import { CustomError } from "./CustomError";

export class DatabaseError extends CustomError {
    public statusCode: 500;
    constructor(message = 'Database crashed. Try again later'){
        super(message)
        Object.setPrototypeOf(this, DatabaseError.prototype)
    }
    serilize(): { message: string; } {
        return {
            message: this.message
        }
    }
}