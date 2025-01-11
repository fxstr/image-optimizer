export default (values, parameterName, supportsRelativeValues = true) => {
  if (!values) {
    throw new Error(`Mandatory GET parameter "${parameterName}" is missing.`);
  }
  // Digits before / are optional, as /ddd is valid
  const match = values.match(/^(\d*)(%?)\/?(\d*)(%?)$/);
  if (!match) {
    throw new Error(`GET parameter "${parameterName}" must be "ddd", "ddd/", "ddd/ddd" or "/ddd" (where ddd is a positive integer), is "${values}" instead.`);
  }
  const [, width, widthUnit, height, heightUnit] = match;
  if (!supportsRelativeValues && (widthUnit || heightUnit)) {
    throw new Error(`GET parameter "${parameterName}" does not support relative values, you passed an invalid % in ${values}.`);
  }
  const normalizedWidth = width ? parseInt(width, 10) : null;
  const normalizedHeight = height ? parseInt(height, 10) : null;
  const normalizedWidthUnit = widthUnit || null;
  const normalizedHeightUnit = heightUnit || null;
  return [normalizedWidth, normalizedWidthUnit, normalizedHeight, normalizedHeightUnit];
};
