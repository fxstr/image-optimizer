export default async (source) => {
  // TODO: Test if we can stream; did not work so far because to resize, we must know the original
  // image's size etc.
  const imageResponse = await fetch(source);
  // TODO: Test for / follow Redirects
  if (!imageResponse.ok) {
    throw new Error(`Could not fetch original image from ${source}: status code is ${imageResponse.status}`);
  }
  // TODO: Test for image formats
  return { image: await imageResponse.arrayBuffer(), headers: imageResponse.headers };
};
