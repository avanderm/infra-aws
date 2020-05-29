FROM node:10-alpine

RUN apk add make

WORKDIR /app
RUN npm install -g aws-cdk
COPY . .
