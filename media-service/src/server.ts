import 'dotenv/config';
import express from 'express';
import helmet from 'helmet';
import cors from 'cors'
import { logger, morganLog } from './utils/logger';
import { errorHandler } from './middleware/errorHandler';
import mongoose from 'mongoose';
import mediaRoutes from './routes/media.routes'
import { connectRabbitMQ, consumeEvent } from './utils/rabbitmq';
import { handlePostDeleted } from './eventHandlers/media.event';

const app = express()

const PORT  = process.env.PORT || 3003

app.use(cors())
app.use(helmet());
app.use(express.json())

app.use(morganLog);

mongoose.connect(process.env.MONGO_URL)
.then(()=> {
    logger.info(`mongoose connection succussfully`)
})
.catch((error)=> {
    logger.error(`error in connection mongoose ${error}`)
})

app.use('/api/media', mediaRoutes)

app.use(errorHandler);

async function startServer(){
    try {
        await connectRabbitMQ()

        //consume all the event 
        await consumeEvent('post.deleted', handlePostDeleted)

        app.listen(PORT, ()=> {
            logger.info(`Media-service running on port ${PORT}`);
        })
    } catch (error) {
        logger.error('Failed to connect to server', error)   
        process.exit(1)
    }
}

startServer()

process.on('unhandleRejection', (reson, promise) => {
    logger.error('unhandleRejection at', promise, "reson:", reson)
})