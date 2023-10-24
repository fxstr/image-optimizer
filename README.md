# Build

## Build Docker File

`docker build -t image-optimizer .`

## Develop

1. `docker run -ditp 127.0.0.1:3000:3000 -w /app --mount type=bind,src="$(pwd)",target=/app node:20-alpine sh -c "apk add --no-cache build-base g++ cairo-dev jpeg-dev pango-dev giflib-dev && npm i && sh"` (run `sh` to keep the container running)
2. `docker exec -it {docker-container-id} /bin/sh`
3. `npm run dev`