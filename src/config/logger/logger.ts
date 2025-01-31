import * as winston from 'winston';
import { LogstashTransport } from 'winston-logstash-transport';

const logstashTransport = new LogstashTransport({
  port: 5000, // Logstash에서 수신 대기 중인 포트
  host: 'logstash', // Logstash 호스트
  reconnectInterval: 1000, // 재연결 간격
});

// 연결 성공 이벤트
logstashTransport.on('connect', () => {
  console.log('Connected to Logstash successfully');
});

// 연결 실패 또는 오류 이벤트
logstashTransport.on('error', (err) => {
  console.error('Error connecting to Logstash:', err);
});

const logger = winston.createLogger({
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.printf(({ level, message, timestamp }) => {
          return `[${timestamp}] check ${level}: ${message}`;
        }),
      ),
    }),
    logstashTransport,
  ],
});

export default logger;
