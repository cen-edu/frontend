# 배포 이미지. 정적 빌드 산출물을 nginx 로 서빙만 한다.
# /api 프록시는 앞단(백엔드 저장소 deploy/nginx)의 nginx 가 맡는다.
#
#   docker build -t $DOCKERHUB_USER/cen-edu-frontend:1.0.0 \
#     --build-arg VITE_MYSCRIPT_APPLICATION_KEY=... \
#     --build-arg VITE_MYSCRIPT_HMAC_KEY=... .
#   docker push $DOCKERHUB_USER/cen-edu-frontend:1.0.0

# ---------- 1단계: 빌드 ----------
FROM node:22-alpine AS build
WORKDIR /app

# Vite 는 VITE_ 값을 빌드 시점에 번들에 박는다. 런타임 환경 변수로는 바뀌지 않으므로
# 값이 달라지면 이미지를 다시 빌드해야 한다.
ARG VITE_API_BASE_URL=/api
# 기본값 10초는 개발 기준이다. 채점·문항 생성은 백엔드에서 비동기 잡으로 돌아 요청
# 자체는 짧지만, 보고서 PDF 렌더링처럼 동기로 도는 경로가 10초를 넘길 수 있다.
ARG VITE_API_TIMEOUT_MS=60000
ARG VITE_MYSCRIPT_APPLICATION_KEY=
ARG VITE_MYSCRIPT_HMAC_KEY=

# 잠금 파일 그대로 설치한다. npm install 은 lock 을 갱신해 이미지마다 의존성이 달라진다.
COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

# ---------- 2단계: 서빙 ----------
FROM nginx:alpine
COPY deploy/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
