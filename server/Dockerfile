FROM node:lts-alpine AS build

ENV CI=true
ENV SERVER_PORT=3000

WORKDIR /app

COPY package.json /app/package.json
COPY package-lock.json /app/package-lock.json

RUN npm ci

COPY . /app

RUN npm run build

CMD [ "npm", "run", "prod" ]