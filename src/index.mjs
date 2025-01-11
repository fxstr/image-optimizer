import createServer from './createServer.mjs';

const app = createServer();
const host = '0.0.0.0';
const port = 3000;

app.listen(port, host, () => {
  console.log(`Listening on ${host}:${port}`);
});
