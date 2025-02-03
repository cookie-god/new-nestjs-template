import * as winston from 'winston';
// import 'winston-daily-rotate-file';

export const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.Console(), // 콘솔 로그 출력
    new winston.transports.File({
      filename: process.env.LOG_PATH || '/var/log/app/app.log',
      level: 'info',
    }),
  ],
});
