import * as winston from 'winston';
import { LogstashTransport } from 'winston-logstash-transport';

const logger = winston.createLogger({
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.printf(({ level, message, timestamp }) => {
          return `[${timestamp}] ${level}: ${message}`;
        }),
      ),
    }),
    new LogstashTransport({
      port: 5000, // Logstash에서 수신 대기 중인 포트
      host: 'logstash', // Logstash 호스트
    }),
  ],
});

export default logger;
