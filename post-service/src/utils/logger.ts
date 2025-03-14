import { createLogger, format, transports } from "winston";
import morgan from 'morgan'

export const morganLog = morgan(':method :url :status :response-time ms', {
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

// Custom format for console logging with colors 
const consoleLogFormat = format.combine(
  format.colorize(),
  format.printf(({level, message, timestamp}) => {
    return `${level}: ${message}`
  })
)

export const logger = createLogger({
  level: process.env.NODE_ENV === "production" ? "info" : "debug",
  format: format.combine(
    format.timestamp(),
    format.errors({ stack: true }),
    format.splat(),
    format.json()
  ),
  defaultMeta: { service: "post-service" },
  transports: [
    new transports.Console({
      format: format.combine(consoleLogFormat),
    }),
    new transports.File({filename: 'error.log', level: 'error'}),
    new transports.File({filename: 'combine.log'}),
  ],
});


