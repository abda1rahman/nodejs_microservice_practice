import RefreshToken from "../models/refreshToken";
import User from "../models/user.model";
import { generateToken } from "../utils/generateToken";
import { logger } from "../utils/logger"
import { validateLogin, validateRegisration } from "../utils/validation";

// USER REGISTRATION
export const registerUser = async (req:any, res:any) => {
    logger.info('Regisration endpoint hit...');
    try {
        const {error, value} = validateRegisration(req.body);
        if(error){
            logger.warn('Validation error', error.details[0].message)
            return res.status(400).json({
                success: false,
                message: error.details[0].message
            })
        }
        const {email, password, username} = req.body

        let user = await User.findOne({ $or : [{email}, {username}]})
        if(user){
            logger.warn("User already exists")
            return res.status(400).json({
                success: false,
                message: 'User already exists'
            })
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

    } catch (e) {
        logger.error('Registration error occured', e);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        })
    }
}

export const loginUser = async(req, res) => {
    try {
        const {error} = validateLogin(req.body)
        if(error){
            logger.warn('Validation error', error.details[0].message)
            return res.status(400).json({
                success: false,
                message: error.details[0].message
            })
        }
        const {email, password} = req.body;
        const user:any = await User.findOne({email})
        if(!user){
            logger.warn('Invalid user')
            return res.status(400).json({
                success: false,
                message: 'Invalid credentials'
            })
        }

        // valid password or not 
        const isValidPassword = await user.comparePassword(password)
        if(!isValidPassword){
            logger.warn('Invalid password')
            return res.status(400).json({
                success: false,
                message: 'Invalid password'
            })
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

    } catch (error) {
        logger.error('Login error occured', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        }) 
    }
}

// RefreshToken 
export const refreshTokenUser = async(req, res) => {
    logger.info("Refresh token endpoint hit...")
    try {
        const {refreshToken} = req.body
        if(!refreshToken){
            logger.warn('Refresh token missing')
            return res.status(400).json({
                success: false,
                message: 'Refresh token missing'
            })
        }
        const storedToken = await RefreshToken.findOne({token: refreshToken})

        if(!storedToken || storedToken.expiresAt < new Date()){

            logger.warn('Invalied or expired refresh token')
            return res.status(401).json({
                success: false,
                message: "Invalid or expired refresh token"
            })
        }

        const user = await User.findById(storedToken.user)

        if(!user) {
            logger.warn('User not found')
            return res.status(401).json({
                success: false,
                message: "User not found"
            })
        }

        const {accessToken, refreshToken: newRefreshToken} = await generateToken(user);

        await RefreshToken.deleteOne({token: storedToken})

        return res.status(200).json({
            success: true,
            accessToken,
            refreshToken: newRefreshToken
        })

    } catch (error) {
        logger.error('Refresh token error occured', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        })  
    }
}

// logout 
export const logoutUser = async(req, res) => {
    logger.info('Logout endpoint hit ...')
    try {
        const {refreshToken} = req.body;

        if(!refreshToken){
            logger.warn('refreshToken not found')
            return res.status(401).json({
                success: false,
                message: "refreshToken not found"
            })
        }

    await RefreshToken.deleteOne({token: RefreshToken})        
    logger.info('Refresh token deleted for logout')
    res.status(200).json({
        success: true,
        message: 'Logged out successfully'
    })
    } catch (error) {
        logger.error('Logout error occured', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        })  
    }
}