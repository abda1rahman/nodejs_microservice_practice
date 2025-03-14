import { logger } from "../utils/logger";
import jwt from 'jsonwebtoken'

export const validateToken =  (req, res, next)=> {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        if(!token){
            logger.warn('Access attemp without vaild token!')
            return res.status(401).json({
                success: false,
                message: 'Authentication required'
            })
        }

        jwt.verify(token, process.env.jWT_SECRET, (err, user) => {
            if(err){
                logger.warn('Invalid token!')
                return res.status(429).json({
                    success: false,
                    message: 'Invalid token!'
                }) 
            }

            req.user = user
            next()
        })

}