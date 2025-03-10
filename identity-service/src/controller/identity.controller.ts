import asyncHandler from "express-async-handler";
import RefreshToken from "../models/refreshToken";
import User from "../models/user.model";
import { generateToken } from "../utils/generateToken";
import { logger } from "../utils/logger"
import { validateLogin, validateRegisration } from "../utils/validation";
import { AppError } from "../utils/AppError";

// USER REGISTRATION
export const registerUser = asyncHandler(async (req:any, res:any) => {
    logger.info('Regisration endpoint hit...');

        const {error, value} = validateRegisration(req.body);
        if(error){
            logger.warn('Validation error', error.details[0].message)
            throw new AppError(error.details[0].message, 400)
        }
        const {email, password, username} = req.body

        let user = await User.findOne({ $or : [{email}, {username}]})
        if(user){
            logger.warn("User already exists")
            throw new AppError('User already exisits', 400)
        }
        user = new User({username, email, password})
        await user.save();
        logger.warn("User saved successfully", user._id)

        const {refreshToken, accessToken}: any = await generateToken(user)

        res.status(201).json({
            success: true,
            message: 'User registred successfully',
            body: {
                refreshToken,
                accessToken
            }
        })
    })

export const loginUser = asyncHandler(async(req, res) => {

        const {error} = validateLogin(req.body)
        if(error){
            logger.warn('Validation error', error.details[0].message)
            throw new AppError('Validation error', 400);
        }
        const {email, password} = req.body;
        const user:any = await User.findOne({email})
        if(!user){
            throw new AppError('Invalid credentials', 400);
        }

        // valid password or not 
        const isValidPassword = await user.comparePassword(password)
        if(!isValidPassword){
            logger.warn('Invalid password')
            throw new AppError('Invalid email or password', 400)
        }

        //generate token 
        const {accessToken, refreshToken} = await generateToken(user)

        res.json({
            sucess: true,
            message: 'User login successfully',
            accessToken,
            refreshToken,
            user:user._id
        })
})

// RefreshToken 
export const refreshTokenUser = asyncHandler(async(req, res) => {
    logger.info("Refresh token endpoint hit...")
        const {refreshToken} = req.body
        if(!refreshToken){
            logger.warn('Refresh token missing')
            throw new AppError('Refresh token missing', 400)
        }
        const storedToken = await RefreshToken.findOne({token: refreshToken})

        if(!storedToken || storedToken.expiresAt < new Date()){
            logger.warn('Invalied or expired refresh token')
            throw new AppError('Invalid or expired refresh token', 401)
        }

        const user = await User.findById(storedToken.user)

        if(!user) {
            logger.warn('User not found')
            throw new AppError('User not found', 404);
        }

        const {accessToken, refreshToken: newRefreshToken} = await generateToken(user);

        await RefreshToken.deleteOne({token: storedToken})

        res.status(200).json({
            success: true,
            accessToken,
            refreshToken: newRefreshToken
        })
})

// logout 
export const logoutUser = asyncHandler(async(req, res) => {
    logger.info('Logout endpoint hit ...')
        const {refreshToken} = req.body;

        if(!refreshToken){
            logger.warn('refreshToken not found')
            throw new AppError('Refresh Token not found', 401);
        }

    await RefreshToken.deleteOne({token: RefreshToken})        
    logger.info('Refresh token deleted for logout')
    res.status(200).json({
        success: true,
        message: 'Logged out successfully'
    })
})