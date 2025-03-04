import User from "../models/user.model.js";
import { generateToken } from "../utils/generateToken.js";
import { logger } from "../utils/logger.js"
import { validateRegisration } from "../utils/validation.js";

// USER REGISTRATION
export const registerUser = async (req, res) => {
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

        const {refreshToken, accessToken} = await generateToken(user)

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
