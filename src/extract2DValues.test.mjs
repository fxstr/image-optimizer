import extract2DValues from './extract2DValues.mjs';

test('normalizes 2d values', () => {
  // No size
  expect(() => extract2DValues(undefined, 'size')).toThrow('parameter "size" is missing.');
  // Invalid size
  expect(() => extract2DValues('nope', 'size')).toThrow('parameter "size"');
  // ddd
  const onlyWidth = extract2DValues('100');
  expect(onlyWidth).toEqual([100, null, null, null]);
  // ddd/
  const onlyWidthSlash = extract2DValues('100/');
  expect(onlyWidthSlash).toEqual([100, null, null, null]);
  // ddd/ddd
  const widthAndHeight = extract2DValues('100/200');
  expect(widthAndHeight).toEqual([100, null, 200, null]);
  // /ddd
  const slashOnlyHeight = extract2DValues('/200');
  expect(slashOnlyHeight).toEqual([null, null, 200, null]);
  // /
  const slashOnlyWidth = extract2DValues('/');
  expect(slashOnlyWidth).toEqual([null, null, null, null]);
});

test('supports relative values', () => {
  // Width %
  const relativeWidth = extract2DValues('100%/200');
  expect(relativeWidth).toEqual([100, '%', 200, null]);
  // Height %
  const relativeHeight = extract2DValues('100/200%');
  expect(relativeHeight).toEqual([100, null, 200, '%']);
  // Width and height %
  const relativeWidthAndHeight = extract2DValues('100%/200%');
  expect(relativeWidthAndHeight).toEqual([100, '%', 200, '%']);
});

test('throws on unsupported relative values', () => {
  expect(() => extract2DValues('100%/200', 'size', false)).toThrow('does not support relative values');
});
