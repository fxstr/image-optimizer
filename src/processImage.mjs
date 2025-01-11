import sharp from 'sharp';
import getCrop from './getCrop.mjs';

/**
 * Converts a relative focal point into an absolute one, if needed.
 */
const adjustFocalPoint = (value, unit, fullDimension) => {
  if (unit === '%') {
    return (value / 100) * fullDimension;
  }
  return value;
};

export default async (image, parameters) => {
  const output = sharp(image);

  // To resize, we must know the original image's size (at least if a focal point is given)
  const metadata = await output.metadata();

  if (parameters.width || parameters.height) {
    // Sharp and getCrop need height *and* width; if one is missing, get it from the aspect
    // ratio and the other value that's given.
    const aspectRatio = metadata.width / metadata.height;
    // Width/height must be integers
    const width = parameters.width || Math.round(parameters.height * aspectRatio);
    const height = parameters.height || Math.round(parameters.width / aspectRatio);

    // Automatic focal point
    if (parameters.focalPointType === 'auto') {
      output.resize({
        width,
        height,
        fit: sharp.fit.cover,
        position: sharp.strategy.entropy,
      });
    } else if (parameters.focalPointType === 'point' || parameters.focalPointType === null) {
      // No focal point or exact focal point given
      const cropInfo = getCrop({
        inputWidth: metadata.width,
        inputHeight: metadata.height,
        outputWidth: width,
        outputHeight: height,
        focalPointX: adjustFocalPoint(
          parameters.focalPointX,
          parameters.focalPointXUnit,
          // Focal point always relates to the *original* image's size
          metadata.width,
        ),
        focalPointY: adjustFocalPoint(
          parameters.focalPointY,
          parameters.focalPointYUnit,
          metadata.height,
        ),
      });
      output.extract({
        left: cropInfo.x1,
        top: cropInfo.y1,
        width: cropInfo.x2 - cropInfo.x1,
        height: cropInfo.y2 - cropInfo.y1,
      });
      // After cropping/extraging, we must also resize the image
      output.resize({
        height,
        width,
      });
    }
  }

  return output[parameters.format]({ quality: parameters.quality }).toBuffer();
};
