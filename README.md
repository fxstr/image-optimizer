# Run

Run locally (dumb): `node src/invokeWorker.mjs``

Run in Workers environment: `npx wrangler dev src/worker.mjs`

# Build

## Build Docker File

Dockerfile forces a build on linux in order to deploy to Docker. Won't run on macOS.
`docker build -t image-optimizer:[VERSION] .`
`docker run -p 127.0.0.1:3000:3000 image-optimizer:[VERSION]`

## Upload to DigitalOcean

This will auto-deploy:
`docker images`
`docker image tag image-optimizer:[VERSION] registry.digitalocean.com/fxstr/image-optimizer:[VERSION]`
`docker push registry.digitalocean.com/fxstr/image-optimizer:[VERSION]`

More [on Digital Ocean](https://docs.digitalocean.com/products/container-registry/how-to/use-registry-docker-kubernetes/)
and [Docker](https://docs.docker.com/engine/reference/commandline/push/).


## Develop

1. `docker run -ditp 127.0.0.1:3000:3000 -w /app --mount type=bind,src="$(pwd)",target=/app node:20-alpine sh -c "apk add --no-cache build-base g++ cairo-dev jpeg-dev pango-dev giflib-dev && npm i && sh"` (run `sh` to keep the container running)
2. `docker exec -it {docker-container-id} /bin/sh`
3. `npm run dev`