import 'dotenv/config'
import { logger, morganLog } from './utils/logger'
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import Redis from 'ioredis'
import RedisStore from 'rate-limit-redis'
import rateLimit from 'express-rate-limit'
import proxy from 'express-http-proxy'
import { errorHandler } from './middleware/errorHandler'
import { BadRequestError } from './errors/BadRequestError'
import { DatabaseError } from './errors/DatabaseError'
import { tryCatch } from './utils/tryCatch'





const app = express()
const PORT = process.env.PORT || 3000;

app.use(cors())
app.use(helmet())
app.use(express.json())

app.use(morganLog)

const proxyOptions =  {
    proxyReqPathResolver(req) {
        return req.originalUrl.replace(/^\/v1/, '/api')
    },
    proxyErrorHandler: function(err, res, next) {
        logger.error(`Proxy error: ${err.message}`)
        res.status(500).json({
            message: `Internal server Error`
        })
    }
}

//setting up proxy for our identity service
app.use('/v1/auth', proxy(process.env.IDENTITY_SERVICE_URL, {
    ...proxyOptions,
    proxyReqOptDecorator: (proxyReqOpts, srcReq)=>{
        proxyReqOpts.headers['Content-Type'] = "application/json";
        return proxyReqOpts;
    },
    userResDecorator: (proxyRes, proxyResData, userReq, rserRes) => {
        logger.info(`Response received from Identity service: ${proxyRes.statusCode}`)
        return proxyResData
    }
}))

// const redisClient = new Redis( process.env.REDIS_URL, {password: '1997'})

// const rateLimiter = rateLimit({
//     windowMs: 15 * 60 * 1000,
//     max: 100,
//     standardHeaders: true,
//     legacyHeaders: false,
//     handler: (req, res) => {
//         logger.warn(`Sensitive endpoint rate limit exceeded for IP${req.ip}`)
//         res.status(429).json({success:false, message: "Too many requests"})
//     },
//     store: new RedisStore({
//         //@ts-ignore
//         sendCommand: (...args) => redisClient.call(...args),
//     })
    
// })

// app.use(rateLimiter);

const getUser = () => undefined;

// app.all('*', tryCatch(async(req, res)=> {
//     const user = getUser();
//   if(!user) {
//     throw new DatabaseError('Error in connection Database');
//   }

//   return res.status(200).json({success: true})
// }))

app.use((req, res, next) => {
    logger.info(`Received ${req.method} request to ${req.url}`)
    logger.info(`Request body, ${req.body}`);
    next()
})

app.use(errorHandler)

app.listen(PORT, () => {
    logger.info(`API Gateway is running on port ${PORT}`)
    logger.info(`Identity service is running on port ${process.env.IDENTITY_SERVICE_URL}`)
    // logger.info(`Redis URL ${process.env.REDIS_URL}`)
})