import * as winston from 'winston';
import * as DailyRotateFile from 'winston-daily-rotate-file';

const { combine, timestamp, json, colorize, printf } = winston.format;

function safeStringify(obj: any, space = 2) {
  const seen = new WeakSet();
  return JSON.stringify(
    obj,
    (key, value) => {
      if (typeof value === 'object' && value !== null) {
        if (seen.has(value)) return '[Circular]';
        seen.add(value);
      }
      return value;
    },
    space,
  );
}

// 커스텀 콘솔 포맷: 메시지와 함께 전달된 추가 메타데이터를 JSON.stringify로 예쁘게 출력
const customConsoleFormat = printf(({ level, message, timestamp, ...meta }) => {
  let output = `[${timestamp}] ${level}: ${message}`;
  if (Object.keys(meta).length) {
    // meta에 내용이 있다면
    output += `\n${safeStringify(meta)}`;
  }
  return output;
});

export const logger = winston.createLogger({
  level: 'info',
  transports: [
    // 날짜별로 생성되는 일반 로그 파일 설정
    new DailyRotateFile({
      dirname: 'logs', // 로그 파일이 저장될 디렉터리 (없으면 자동 생성)
      filename: '%DATE%-combined.log', // 파일 이름 형식 (예: 2025-02-04-combined.log)
      datePattern: 'YYYY-MM-DD', // 날짜 형식
      zippedArchive: true, // 로그 파일 압축 여부
      maxSize: '20m', // 개별 파일 최대 크기
      maxFiles: '14d', // 14일 이후 파일 자동 삭제
      level: 'info',
      format: combine(timestamp(), json()),
    }),
    // 날짜별로 생성되는 경고 로그 파일 설정
    new DailyRotateFile({
      dirname: 'logs',
      filename: '%DATE%-warn.log',
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '14d',
      level: 'warn',
      format: combine(timestamp(), json()),
    }),
    // 날짜별로 생성되는 에러 로그 파일 설정
    new DailyRotateFile({
      dirname: 'logs',
      filename: '%DATE%-error.log',
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '14d',
      level: 'error',
      format: combine(timestamp(), json()),
    }),
    // 개발 환경 등에서 콘솔에 로그 출력
    new winston.transports.Console({
      format: combine(
        colorize(),
        timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        customConsoleFormat,
      ),
    }),
  ],
});
