# syntax=docker/dockerfile:1

FROM node:20-alpine
WORKDIR /app
COPY . .
RUN apk add --no-cache build-base g++ cairo-dev jpeg-dev pango-dev giflib-dev
RUN npm i
CMD ["nodemon", "src/index.js"]
EXPOSE 3000