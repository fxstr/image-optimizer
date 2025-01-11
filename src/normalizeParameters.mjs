import extract2DValues from './extract2DValues.mjs';

export default (query) => {
  const normalizedParameters = {
    source: null,
    format: null,
    width: null,
    height: null,
    focalPointType: null, // auto, point or null
    focalPointX: null,
    focalPointXUnit: null,
    focalPointY: null,
    focalPointYUnit: null,
    quality: null,
  };
  let shouldRedirect = false;

  const { source } = query;

  if (!source || typeof source !== 'string') {
    throw new Error('GET parameter "source" is required and must be a string.');
  }
  normalizedParameters.source = source;

  let { format } = query;
  // Default format is jpeg
  if (!format || format === 'jpg') {
    // 'jpeg' is used for the sharp API; must correspond
    format = 'jpeg';
    shouldRedirect = true;
  }
  const validFormats = ['webp', 'jpeg', 'avif', 'png'];
  if (!validFormats.includes(format)) {
    throw new Error(`GET parameter "format" must be one of ${validFormats.map(((value) => `"${value}"`)).join(', ')}., you passed "${format}" instead.`);
  }
  normalizedParameters.format = format;

  const { size } = query;
  // Empty variable between width and height: widthUnit (not needed here)
  const [width, , height] = size ? extract2DValues(size, 'size', false) : [null, null, null, null];
  normalizedParameters.width = width;
  normalizedParameters.height = height;

  const focalPoint = query.focalpoint;
  if (focalPoint === 'auto') {
    normalizedParameters.focalPointType = 'auto';
  } else if (focalPoint) {
    const [
      focalPointX,
      focalPointXUnit,
      focalPointY,
      focalPointYUnit,
    ] = extract2DValues(focalPoint, 'focalPoint');
    normalizedParameters.focalPointX = focalPointX;
    normalizedParameters.focalPointXUnit = focalPointXUnit;
    normalizedParameters.focalPointY = focalPointY;
    normalizedParameters.focalPointYUnit = focalPointYUnit;
    normalizedParameters.focalPointType = 'point';
  }

  const { quality } = query;
  if (quality) {
    const normalizedQuality = parseInt(quality, 10);
    if (Number.isNaN(normalizedQuality) || normalizedQuality < 1 || normalizedQuality > 100) {
      throw new Error(`GET parameter "quality" must be a positive integer between 1 and 100, is "${quality}" instead.`);
    }
    normalizedParameters.quality = normalizedQuality;
  } else {
    normalizedParameters.quality = 75;
  }

  // TODO
  // If shouldRedirect is set, redirect (to make sure that the response is cached correctly)

  return normalizedParameters;
};
