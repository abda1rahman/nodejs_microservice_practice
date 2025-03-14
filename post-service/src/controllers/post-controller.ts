import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { validateCreatePost } from "../utils/Validation";
import { AppError } from "../utils/AppError";
import User from "../models/user.model";
import { logger } from "../utils/logger";
import { Post } from "../models/Post";
import mongoose from "mongoose";

 const createPost = asyncHandler(async (req, res:Response) => {
    logger.info('postController hit')
    const {content, mediaIds} = req.body;

    const {error, value} = validateCreatePost.validate(req.body);
    if(error){
        logger.error('Valdation Error');
        throw new AppError(error.details[0].message, 400);
    }
    const createPost = new Post({
        user: req.user.userId,
        content,
        mediaIds: mediaIds || []
    })

    await createPost.save();
    await invalidateReids(req, createPost._id.toString())

    res.status(201).json({success: true, message: 'Post Created Successfully'});

})

const getAllPosts = asyncHandler(async(req, res) => {
    const page = parseInt(req.query.page || 1);
    const limit = req.query.limit || 10;
    const startIndex = (page - 1) * limit;

    const cacheKey = `posts:${page}:${limit}`;
    const cachedPosts = await req.redisClient.get(cacheKey)

    if(cachedPosts){
        return res.status(200).json(JSON.parse(cachedPosts))
    }

    const posts = await Post.find().sort({createdAt: -1}).skip(startIndex).limit(limit)

    const totalNumOfPost = await Post.countDocuments();

    const result = {
        posts,
        currentpage: page,
        totalPages: Math.ceil(totalNumOfPost/limit),
        totalPosts: totalNumOfPost
    }
    
    // save posts in redis cache
    await req.redisClient.setex(cacheKey, 300, JSON.stringify(result))

    return res.status(200).json({success: true, result})

})

const getPost = asyncHandler(async(req, res)=> {
    const postId = req.params.id;

    const cachekey = `post:${postId}`;
    const cachePost = await req.redisClient.get(cachekey)

    if(cachePost){
        return res.json(JSON.parse(cachePost))
    }

    const singlePost = await Post.findById(postId);
    if(!singlePost){
        throw new AppError('Post not found', 404);
    }
    await req.redisClient.setex(cachekey, 3600, JSON.stringify(singlePost))

    return res.status(200).json({success: true, result: singlePost})

})

const deletePost = asyncHandler(async(req, res) => {
    const postId = req.params.id;

    const post = await Post.findByIdAndDelete({
        _id: postId,
        user: req.user.userId
    });

    if(!post){
        throw new AppError('Post not found', 404);
    }

    await invalidateReids(req, postId)

    return res.status(200).json({success: true, message: 'Post deleted successfully'});
})

const invalidateReids = async(req, input)=>{
    try {
        const cacheKey = `post:${input}`
        if(input){
            await req.redisClient.del(cacheKey);
        }

        const keys = await req.redisClient.keys('posts:*')

        if(keys.length > 0){
            await req.redisClient.del(keys)
        }
    } catch (error) {
        logger.error(`Error in validate Redis ${error.message}`)
    }
}

export {
    createPost,
    getAllPosts,
    getPost,
    deletePost
}