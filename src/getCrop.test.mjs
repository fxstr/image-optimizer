import getCrop from './getCrop.mjs';

const createParams = (...values) => ({
  inputWidth: values[0],
  inputHeight: values[1],
  outputWidth: values[2],
  outputHeight: values[3],
  focalPointX: values[4],
  focalPointY: values[5],
});

const createOutputParams = (...values) => ({
  x1: values[0],
  y1: values[1],
  x2: values[2],
  y2: values[3],
});

test('crops without focal point', () => {
  // Landscape to portrait
  expect(getCrop(createParams(200, 100, 25, 50))).toEqual(createOutputParams(75, 0, 125, 100));
  // Portrait to landscape
  expect(getCrop(createParams(100, 200, 50, 25))).toEqual(createOutputParams(0, 75, 100, 125));
  // Square to square
  expect(getCrop(createParams(100, 100, 50, 50))).toEqual(createOutputParams(0, 0, 100, 100));
  // Portrait to portrait
  expect(getCrop(createParams(200, 100, 50, 10))).toEqual(createOutputParams(0, 30, 200, 70));
  // Landscape to landscape
  expect(getCrop(createParams(100, 200, 10, 50))).toEqual(createOutputParams(30, 0, 70, 200));
});

test('rounds cropping points', () => {
  expect(getCrop(createParams(200, 100, 35, 60))).toEqual(createOutputParams(71, 0, 129, 100));
});

test('uses focal point', () => {
  expect(getCrop(createParams(200, 100, 25, 50, 120, 0)))
    .toEqual(createOutputParams(95, 0, 145, 100));
  // Does not go beyond image's borders
  expect(getCrop(createParams(200, 100, 25, 50, 200, 0)))
    .toEqual(createOutputParams(150, 0, 200, 100));
  expect(getCrop(createParams(200, 100, 25, 50, -10, 0)))
    .toEqual(createOutputParams(0, 0, 50, 100));
});

test('scales up', () => {
  expect(getCrop(createParams(25, 50, 200, 100))).toEqual(createOutputParams(0, 19, 25, 32)); 
});
