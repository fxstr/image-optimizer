FROM node:22-alpine
WORKDIR /app
COPY . .
RUN rm -rf node_modules
RUN apk update
RUN apk add --no-cache \
  build-base \
  g++ \
  cairo-dev \
  jpeg-dev \
  pango-dev \
  giflib-dev
RUN npm i
CMD ["npx", "nodemon", "src/index.mjs"]
EXPOSE 3000