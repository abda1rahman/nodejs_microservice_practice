import express, { Request } from 'express'
import helmet from 'helmet';
import cors from 'cors'
import 'dotenv/config'
import postRoute from './routes/post.routes'
import { errorHandler } from './middleware/errorHandler';
import { logger, morganLog } from './utils/logger';
import mongoose from 'mongoose';
import Redis from 'ioredis';
import { connectRabbitMQ } from './utils/rabbitmq';

const app = express();

const PORT = process.env.PORT || 3002

mongoose.connect(process.env.MONGO_URL)
.then(()=> {
    logger.info(`mongoose connection succussfully`)
})
.catch((error)=> {
    logger.error(`error in connection mongoose ${error}`)
})



app.use(express.json())
app.use(helmet())
app.use(cors())

app.use(morganLog)

const redisClient = new Redis( process.env.REDIS_URL, {password: '1997'});


app.use('/api/posts',
    (req:any, res, next) => {
        req.redisClient = redisClient;
        next()
    },
    postRoute)

app.use(errorHandler)

async function startServer(){
    try {
        await connectRabbitMQ()
        
        app.listen(PORT, ()=> {
            logger.info(`Post-service is running on port: ${PORT}`)
        })
    } catch (error) {
        logger.error('Failed to connect to server', error)
        process.exit(1);
    }
}

startServer()

process.on('unhandleRejection', (reson, promise) => {
    logger.error('unhandleRejection at', promise, "reson:", reson)
})

