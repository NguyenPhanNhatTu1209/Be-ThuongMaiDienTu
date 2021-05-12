FROM node:10.16.0-alpine AS builder
WORKDIR /usr/src/app
COPY package.json yarn.lock uploads ./
COPY . .
RUN npm install --production
RUN npm run build:prod
FROM node:10.16.0-alpine
WORKDIR /usr/src/app
COPY --from=builder /usr/src/app/node_modules/. ./node_modules  
COPY --from=builder /usr/src/app/dist/. ./dist
COPY --from=builder /usr/src/app/uploads/. ./uploads
COPY ./package.json ./package.json
CMD [ "npm","run","start:prod" ]