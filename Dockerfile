# 1. Node.js 22.12.0 이미지 사용
FROM node:22.12.0-alpine

# 2. 시간대 설정
RUN apk add --no-cache tzdata \
  && ln -snf /usr/share/zoneinfo/Asia/Seoul /etc/localtime \
  && echo "Asia/Seoul" > /etc/timezone

# 3. 작업 디렉토리 설정
WORKDIR /app

# 4. 의존성 파일 복사
COPY package*.json ./

# 5. 의존성 설치
RUN npm install

# 6. 전체 프로젝트 파일 복사
COPY . .

# 7. 빌드
RUN npm run build

# 8. 개발 환경에서는 watch 모드로 실행
ENV NODE_ENV=dev

# 9. 컨테이너 포트 열기
EXPOSE 3000

# 10. 개발 서버 시작
CMD ["npm", "run", "dev"]