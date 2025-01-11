# Overview

Converts an image from an online source in **real time** to an image of a desired output format. 

# Features
- Support for JPG, AVIF, WebP, PNG
- Supports resizing (width or height)
- Supports focal points (absolute, relative and automatic discovery)
- Supports quality flags
- Provides caching (once an image has been converted, it is loaded much faster as it is delivered
  directly from cache) 

# API

## Convert

### Examples

1. Convert an imag to AVIF:
    `/convert?source=https://fxstr.com/out/test.jpg&format=avif`
2. Convert to WebP, width 720px, height 240px, quality 50, automatic focal point
    `/convert?source=https://fxstr.com/out/test.jpg&size=720/240&quality=50&focalpoint=auto&format=webp`
2. Convert to Jpeg, width 720px, focal point at 200px/50%:
    `/convert?source=https://fxstr.com/out/test.jpg&format=jpeg&size=720/&focalpoint=200/50%`

### Endpoint
Call the base URL plus `/convert`, then add your parameters.

### Parameters

#### Source
Mandatory. Provide a URL starting with `http://` or `https://` that points to an image file.

Format: `source={url}`

Example: `source=https://fxstr.com/out/test.jpg`

#### Format

Optional; defaults to `jpeg`. Valid values are currently
- `avif`
- `png`
- `jpeg`
- `webp`

Format: `format=avif|png|jpeg|webp`

Example: `format=avif`

#### Quality

Optional. Sets the output quality, defaults to 75.

Format: `quality={quality}` where `quality` is an integer between 1 and 100.

Example: 
- `quality=50`

#### Size

Optional. Resizes the image. You may provide the width, height or both.

Format: `{width?}/{height?}` where height or width or both can be provided and must be positive
integers.

Examples:
- `size=720/` for a width of 720px (aspect ratio is preserved).
- `size=/480` for a height of 480px (aspect ratio is preserved).
- `size=720/480` for a width of 720px and a height of 480px. Without using the `focalpint`
parameter, the image will be cropped around its center.

#### Focal Point

Optional. If you provide height and width for the `size` parameter, parts of the image may be
cropped/lost. By setting the focal point, you can specify which parts should be kept.

Format: `auto|{width?}%?/{height?}%?` where height and width have to be positive integers.
Absolute values always refer to the original image's size.

Examples:
- `focalpoint=auto` uses
    [Sharp's `attention` algorithm](https://sharp.pixelplumbing.com/api-resize#resize).
- `focalpoint=200/400` centers the image around the point 200px/400px in the original image.
- `focalpoint=10%/` centers the image on the x axis around 10% of the original image's width;
    on the y axis, the focal point is centered.
- `focalpoint=200/5%` centers the image on the x axis around 5% and on the y axis around 200px
    relating to the the original image.
