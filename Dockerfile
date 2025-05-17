# 最新版LTSのNodeイメージ（2025年2月時点）
FROM node:22.13.1-alpine

ENV LANG=C.UTF-8 \
    TZ=Asia/Tokyo

WORKDIR /front
COPY package.json package-lock.json /front/
RUN npm install
COPY . /front/

EXPOSE 3000

CMD [ "npm", "run", "dev" ]