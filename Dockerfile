FROM node:12-alpine

RUN apk add make

WORKDIR /app
RUN npm install -g aws-cdk

COPY package.json package-lock.json tsconfig.json cdk.json cdk.context.json ./
RUN npm install

COPY bin bin
COPY lib lib
RUN npm run build

COPY Makefile .