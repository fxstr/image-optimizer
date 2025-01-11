import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readFileSync } from 'fs';
import { marked } from 'marked';
import express from 'express';
import downloadImage from './downloadImage.mjs';
import normalizeParameters from './normalizeParameters.mjs';
import processImage from './processImage.mjs';

// Get the current file URL
const directoryPath = dirname(fileURLToPath(import.meta.url));

export default () => {
  const app = express();
  app.disable('x-powered-by');

  app.get('/convert', async (request, response) => {
    try {
      const parameters = normalizeParameters(request.query);
      const { image: inputImage, headers } = await downloadImage(parameters.source);
      const outputBuffer = await processImage(inputImage, parameters);
      response.type(parameters.format);
      response.set('Cache-Control', headers.get('cache-control'));
      response.send(outputBuffer);
    } catch (error) {
      response.type('text');
      response.status(500).send(error.message);
      console.error(error);
    }
  });

  app.get('/', (request, response) => {
    const docs = marked.parse(readFileSync(join(directoryPath, '../docs/API.md'), 'utf8'));
    response.type('text/html').send(docs);
  });

  return app;
};
