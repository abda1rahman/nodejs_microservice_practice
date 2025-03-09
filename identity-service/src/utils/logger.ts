import { Request, Response } from "express";
import morgan from "morgan";
import { createLogger, format, transports } from "winston";



 const logger = createLogger({
  level: process.env.NODE_ENV === "production" ? "info" : "debug",
  format: format.combine(
    format.timestamp(),
    format.errors({ stack: true }),
    format.splat(),
    format.json()
  ),
  defaultMeta: { service: "identity-service" },
  transports: [
    new transports.Console({
      format: format.combine(format.colorize(), format.simple()),
    }),
    new transports.File({filename: 'error.log', level: 'error'}),
    new transports.File({filename: 'combine.log'}),
  ],
});

const morganLog = morgan(':method :url :status :response-time ms', {
  stream: {
    write: (message) => {
      const logObject = {
        method: message.split(' ')[0],
        url: message.split(' ')[1],
        status: message.split(' ')[2],
        responseTime: message.split(' ')[3]
      }
      logger.info(JSON.stringify(logObject))
    }
  },
})

export  {logger, morganLog}