import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import { LogstashTransport } from 'winston-logstash-transport';

const newlineJsonFormat = winston.format.printf((info) => {
  return JSON.stringify(info) + '\n';
});

export const logger = WinstonModule.createLogger({
  format: winston.format.combine(winston.format.timestamp(), newlineJsonFormat),
  transports: [
    // 콘솔 출력용 (로컬 디버깅)
    new winston.transports.Console({
      format: newlineJsonFormat,
    }),
    // Logstash 전송용
    new LogstashTransport({
      host: 'logstash', // docker-compose 등 네트워크 상에서 Logstash 호스트 이름 또는 IP
      port: 5000, // Logstash의 TCP 입력 포트 (pipeline.conf와 일치)
      level: 'info',
    }),
  ],
});
