import request from 'supertest';
import express from 'express';
import createServer from './createServer.mjs';
import sharp from 'sharp';

let server;

// Expose media directory for local testing (when we're in a TGV in France, e.g.)
beforeAll(() => {
  const app = express();
  app.use('/media', express.static('media'));
  server = app.listen(3200);
});

afterAll((done) => {
  server.close(() => {
    done();
  });
});

/**
 * Test actual Express server
 */
test('fails on missing source', async () => {
  const app = createServer();

  // Whatev, createServer or app do not return a Promise.
  const response = await request(app)
    .get('/convert')
    .expect(500);
  expect(response.text.includes('"source"')).toBe(true);
});

test('works with valid arguments', (done) => {
  const app = createServer();
  const chunks = [];
  // Do not use a Promise here as the tes
  request(app)
    .get('/convert?source=http://0.0.0.0:3200/media/test.jpg')
    .expect(200)
    .parse((response, callback) => {
      // We must consume the stream or it will never end
      response.on('data', (chunk) => { chunks.push(chunk); });
      response.on('end', () => { callback(null, Buffer.concat(chunks)); });
      response.on('error', callback);
    })
    .then((response) => {
      expect(response.headers['content-type']).toBe('image/jpeg');
      done();
    })
    .catch((error) => {
      console.error(error);
      throw error;
    });
});

test('works with parameters', (done) => {
  const app = createServer();
  const chunks = [];
  request(app)
    .get('/convert?source=http://0.0.0.0:3200/media/test.jpg&size=500/200&format=avif&focalpoint=200/10%')
    .expect(200)
    .parse((response, callback) => {
      // We must consume the stream or it will never end
      response.on('data', (chunk) => { chunks.push(chunk); });
      response.on('end', () => { callback(null, Buffer.concat(chunks)); });
      response.on('error', callback);
    })
    .then((response) => {
      expect(response.headers['content-type']).toBe('application/octet-stream');
      return sharp(response.body).metadata();
    })
    .then((metadata) => {
      expect(metadata.width).toBe(500);
      expect(metadata.height).toBe(200);
      done();
    })
    .catch((error) => {
      console.error(error);
      throw error;
    });
}, 20000);
