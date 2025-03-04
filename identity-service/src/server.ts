import 'dotenv/config'; // This is correct
import mongoose from "mongoose";
import express from 'express'
import helmet from 'helmet';
import cors from 'cors'
import { RateLimiterMemory } from "rate-limiter-flexible";

import { logger } from "./utils/logger"

const app = express()

// connect to database 
mongoose.connect(process.env.MONGO_URL || "")
.then(() => logger.info("Connected to mongodb"))
.catch((e) => logger.error("Mongo connection error" , e))

app.use(helmet())
app.use(cors())
app.use(express.json())

app.use((req, res, next) => {
    logger.info(`Received ${req.method} request to ${req.url}`)
    logger.info(`Request body ${req.body}`)
    next();
})