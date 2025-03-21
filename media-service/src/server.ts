import 'dotenv/config';
import express from 'express';
import helmet from 'helmet';
import cors from 'cors'
import { logger, morganLog } from './utils/logger';
import { errorHandler } from './middleware/errorHandler';
import mongoose from 'mongoose';
import mediaRoutes from './routes/media.routes'

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

app.listen(PORT, ()=> {
    logger.info(`media-service running on port ${PORT}`);
})

process.on('unhandleRejection', (reson, promise) => {
    logger.error('unhandleRejection at', promise, "reson:", reson)
})