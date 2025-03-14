import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.ObjectId,
             ref: 'User',
             required: true
        },
        content: {
            type: String,
            required: true,
        },
        mediaIds : [
            {
                type: String
            }
        ]
    },{timestamps: true})

    postSchema.index({content: 'text'})

    export const Post =  mongoose.model('POST', postSchema);
