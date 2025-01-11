import normalizeParameters from './normalizeParameters.mjs';

test('normalizes source', () => {
  // Source missing
  expect(() => normalizeParameters({ source: 123 })).toThrow('parameter "source"');
  // Regular source
  const source = 'https://example.com/image.jpg';
  const normalized = normalizeParameters({ source: 'https://example.com/image.jpg' });
  expect(normalized.source).toBe(source);
});

test('normalizes format', () => {
  const source = { source: 'https://example.com/image.jpg' };
  // No value: jpeg as default
  const noFormat = normalizeParameters({ ...source });
  expect(noFormat.format).toBe('jpeg');
  // Invalid format
  expect(() => normalizeParameters({ ...source, format: 123 })).toThrow('parameter "format"');
  // jpg to jpeg
  const jpgFormat = normalizeParameters({ ...source, format: 'jpg' });
  expect(jpgFormat.format).toBe('jpeg');
  // webp
  const webpFormat = normalizeParameters({ ...source, format: 'webp' });
  expect(webpFormat.format).toBe('webp');
});

test('normalizes size', () => {
  const source = { source: 'https://example.com/image.jpg' };
  const values = normalizeParameters({ ...source, size: '/200' });
  expect(values.width).toBe(null);
  expect(values.height).toBe(200);
});

test('normalizes focal point', () => {
  const source = { source: 'https://example.com/image.jpg' };
  // No focal point
  const noFocalPoint = normalizeParameters({ ...source });
  expect(noFocalPoint.focalPointType).toBe(null);
  // Auto
  const autoFocalPoint = normalizeParameters({ ...source, focalpoint: 'auto' });
  expect(autoFocalPoint.focalPointType).toBe('auto');
  // Invalid focal point
  expect(() => normalizeParameters({ ...source, focalpoint: 'nope' }))
    .toThrow('parameter "focalPoint"');
  // Regular focal point
  const normalizedFocalPoint = normalizeParameters({ ...source, focalpoint: '/200%' });
  expect(normalizedFocalPoint.focalPointType).toBe('point');
  expect(normalizedFocalPoint.focalPointX).toBe(null);
  expect(normalizedFocalPoint.focalPointXUnit).toBe(null);
  expect(normalizedFocalPoint.focalPointY).toBe(200);
  expect(normalizedFocalPoint.focalPointYUnit).toBe('%');
});

test('normalizes quality', () => {
  const source = { source: 'https://example.com/image.jpg' };
  // No quality
  const noQuality = normalizeParameters({ ...source });
  expect(noQuality.quality).toBe(75);
  // Invalid quality
  expect(() => normalizeParameters({ ...source, quality: 'nope' })).toThrow('parameter "quality"');
  // Regular value
  const normalizedQuality = normalizeParameters({ ...source, quality: '100' });
  expect(normalizedQuality.quality).toBe(100);
});
