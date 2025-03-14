import mongoose from "mongoose";


const userSchema=  new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim : true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim : true
    },
    password: {
        type: String,
        required: true,
    },
    createdAt : {
        type: Date,
        default: Date.now
    },
},
    {
        timestamps: true
    }
)


userSchema.index({username: 'text'})

 const User = mongoose.model("User", userSchema);
 export default User;
