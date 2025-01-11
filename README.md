# About

Optimizes images on demand. See [API.md](docs/API.md) for details.

# Install

`npm run i`

# Run

Run local server (auto-reload): `npm run dev`
Run local server (no auto-reload): `npm run start`

# Deploy

Initial deployment on fly.io:
`flyctl launch`

To fly.io after server was launched:
`flyctl deploy`

When you change `fly.toml`, use `-c fly.toml` to force a server update.