import { CustomError } from "./CustomError";

export class DatabaseError extends CustomError {
    statusCode = 500;
    _message:string;
    constructor(_message?:string){
        super('Database crashed. Try again later');
        Object.setPrototypeOf(this, DatabaseError.prototype)
    }

    serialize(): { success: boolean; message: string; } {
        return {success: false, message: this.message || 'Error in Database'}
    }
}