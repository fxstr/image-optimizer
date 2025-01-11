/**
 * If the input is wider than the output, use the original's height as new height and crop
 * horizontally around the (x) focal point.
 * Use the same function for portrait and landscape by switching the parameters.
 */
const cropPortraitToLandscape = ({
  inputWidth,
  inputHeight,
  outputWidth,
  outputHeight,
  // Use center as default focal point
  focalPointX = inputWidth / 2,
} = {}) => {
  const y1 = 0;
  const y2 = inputHeight;
  // Width of the output, scaled to match the input (if its height is larger/smaller than
  // the output's height)
  const adjustedOutputWidth = outputWidth * (inputHeight / outputHeight);
  const rawX1 = Math.round(focalPointX - (adjustedOutputWidth / 2));
  // Make sure x1 is not < 0 and also that x2 won't be > than the in put's width
  const x1 = Math.max(0, Math.min(rawX1, inputWidth - adjustedOutputWidth));
  const x2 = Math.round((x1 + adjustedOutputWidth));
  return {
    x1,
    y1,
    x2,
    y2,
  };
};

/**
 * Returns the coordinates to crop an image based on input and output dimensions as well as a focal
 * point.
 */
export default ({
  inputWidth,
  inputHeight,
  outputWidth,
  outputHeight,
  focalPointX,
  focalPointY,
} = {}) => {
  // TODO: Should we ever scale up?
  const inputAspectRatio = inputWidth / inputHeight;
  const outputAspectRatio = outputWidth / outputHeight;

  // Handle landscape that is cropped to portrait and square
  if (inputAspectRatio >= outputAspectRatio) {
    return cropPortraitToLandscape({
      inputWidth,
      inputHeight,
      outputWidth,
      outputHeight,
      focalPointX,
    });
  }

  // Handle portrait that is cropped to portrait by just switching dimensions
  // and using the original function
  const {
    x1,
    y1,
    x2,
    y2,
  } = cropPortraitToLandscape({
    inputWidth: inputHeight,
    inputHeight: inputWidth,
    outputWidth: outputHeight,
    outputHeight: outputWidth,
    focalPointX: focalPointY,
  });
  return {
    x1: y1,
    y1: x1,
    x2: y2,
    y2: x2,
  };
};
