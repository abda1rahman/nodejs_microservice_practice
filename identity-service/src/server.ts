import 'dotenv/config'; // This is correct
import mongoose from "mongoose";
import express from 'express'
import helmet from 'helmet';
import cors from 'cors'
import { RateLimiterRedis } from "rate-limiter-flexible";
import Redis from 'ioredis';

import { logger, morganLog } from "./utils/logger"
import rateLimit from 'express-rate-limit';
import RedisStore from 'rate-limit-redis';
import userRoutes from './routes/identity.router';
import { errorHandler } from './middleware/errorHandler';

const app = express()

// connect to Database
mongoose.connect(process.env.MONGO_URL || "")
.then(() => logger.info("Connected to mongodb"))
.catch((e) => logger.error("Mongo connection error" , e))

const PORT = process.env.PORT || 3001

// connect to Redis
// const redisClient = new Redis(process.env.REDIS_URL as string)

//DDos protection and rate limiting 
// const rateLimiter = new RateLimiterRedis({
//     storeClient: redisClient,
//     keyPrefix : middleware,
//     points : 10,
//     duration: 1,
//     blockDuration: 30
// })

// app.use((req,res, next) => {
//     rateLimit.consume(req.ip).then(() => next()).catch(() => {
//         logger.warn(`Rate limit exceeded for IP: ${req.ip}`);
//         res.status(429).json({success: false, message: 'Too many requiests'})
//     })
// })

app.use(helmet())
app.use(cors())
app.use(express.json())

app.use(morganLog)

// app.use(morgan(':method :url :status :res[content-length] - :response-time ms') ,(req, res, next) => {
    
//     logger.info(`Received ${req.method} request to ${req.url}`)
//     logger.info(`Request body ${JSON.stringify(req.body)}`)
//     next();
// })

// Ip based rate limiting for sensitive endpoints 
const sensitiveEndpointsLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
        logger.warn(`Sensitive ndpoint rate limit exceeded for IP ;${req.ip}`);
        res.status(429).json({success: false, message: 'Too many requiests'})

    },
    // store: new RedisStore({
    //     sendCommand: (...args) => redisClient.call(..args)
    // })
})

// apply this sensitiveEndpointsLimiter to our routes
app.use('/api/auth/register', sensitiveEndpointsLimiter)

// Routes
app.use('/api/auth',userRoutes);

app.use(errorHandler)

app.listen(PORT, () => {
    logger.info(`Idnetity service running one port ${PORT}`)
})

process.on('unhandleRejection', (reson, promise) => {
    logger.error('unhandleRejection at', promise, "reson:", reson)
})