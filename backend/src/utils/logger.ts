import winston from 'winston';
import { Env } from '../config/env.config';
const { combine, timestamp, printf,colorize,errors,json } = winston.format;
const transports: winston.transport[]=[]

if (Env.NODE_ENV !== 'production') {
    transports.push(new winston.transports.Console({
        format:combine(
            timestamp({ format: 'YYYY-MM-DD HH:mm:ss A' }),
            errors({ stack: true }),

            printf(({level, message,stack,timestamp,...meta}) =>{
                
                return `${timestamp} [${level?.toUpperCase()}]: ${message} ${stack ? stack:""} ${Object.keys(meta).length ? JSON.stringify(meta) : ''}`
            }),
            colorize({
                all: true,
                colors:{
                    error: 'red',
                    warn: 'yellow',
                    info: 'blue',
                    debug: 'cyan',
                    verbose: 'gray',
                    http: 'green',
                    

                }
            })
        )
    }))
}
const logger = winston.createLogger({
    level: Env.LOG_LEVEL || 'info',
    format: combine(timestamp(),errors({ stack: true }),json()),
    transports: transports,
    silent: Env.NODE_ENV === 'test',
})

export {logger};