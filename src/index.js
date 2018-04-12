import exif from './exif';

const EXIF_TRANSFORMS = {
  1: { rotate: 0, flip: false },
  2: { rotate: 0, flip: true },
  3: { rotate: Math.PI, flip: false },
  4: { rotate: Math.PI, flip: true },
  5: { rotate: Math.PI * 1.5, flip: true },
  6: { rotate: Math.PI * 0.5, flip: false },
  7: { rotate: Math.PI * 0.5, flip: true },
  8: { rotate: Math.PI * 1.5, flip: false },
};

const ROTATE_DEGRESS = [0, 90, 180, 270];

const transformCanvas = (ctx, degrees = 0, flip = false) => {
  ctx.translate(ctx.canvas.width / 2, ctx.canvas.height / 2);
  ctx.rotate(degrees);
  if (flip) ctx.scale(-1, 1);
  return ctx;
};

const exifTransformCanvas = (ctx, orientation) => {
  const transform = EXIF_TRANSFORMS[orientation];
  if (transform) {
    return transformCanvas(ctx, transform.rotate, transform.flip);
  }
  return ctx;
};

const getCanvasForImage = (image, maxWidth, size) => {
  const canvas = document.createElement('canvas');
  let w = size.width;
  let h = size.height;

  if (maxWidth && w > maxWidth) {
    const ratio = w / h;
    w = maxWidth;
    h = w / ratio;
  }

  canvas.width = w;
  canvas.height = h;
  return canvas;
};

const createImage = blob =>
  new Promise(resolve => {
    const image = new Image();

    image.src = URL.createObjectURL(blob);
    image.onload = () => resolve(image);
  });

const rotateAndResize = async (
  arrayBuffer,
  exifOrientationId,
  maxWidth,
  quality,
  rotate = 0,
) => {
  if (!EXIF_TRANSFORMS[exifOrientationId]) return arrayBuffer;

  const blob = new Blob([arrayBuffer]);
  const image = await createImage(blob);

  const canvas = getCanvasForImage(arrayBuffer, maxWidth || image.width, {
    width: image.width,
    height: image.height,
  });

  const w = canvas.width;
  const h = canvas.height;

  if (exifOrientationId > 4 || rotate === 90 || rotate === 270) {
    const temp = canvas.width;
    canvas.width = canvas.height;
    canvas.height = temp;
  }

  const ctx = exifTransformCanvas(canvas.getContext('2d'), exifOrientationId);

  ctx.rotate(rotate * Math.PI / 180);
  ctx.drawImage(image, 0, 0, image.width, image.height, -w / 2, -h / 2, w, h);

  if (typeof canvas.toBlob !== 'undefined') {
    return new Promise(resolve =>
      canvas.toBlob(resolve, blob.type, quality / 100),
    );
  } else if (typeof canvas.msToBlob !== 'undefined') {
    return canvas.msToBlob();
  }

  return blob;
};

const blobToArrayBuffer = blob =>
  new Promise(resolve => {
    const fileReader = new FileReader();
    fileReader.onload = event => {
      resolve(event.target.result);
    };
    fileReader.readAsArrayBuffer(blob);
  });

const Resizer = async (binary, maxWidth = undefined, quality = 100, rotate) => {
  let orientation = 1;

  try {
    const metadata = await exif(binary);
    if (metadata.Orientation) orientation = metadata.Orientation.value;
  } catch (e) {
    if (e.message !== 'Invalid image format') {
      // eslint-disable-next-line no-console
      console.error('get metadata error', e);
    }
  }
  try {
    const blob = await rotateAndResize(
      binary,
      orientation,
      maxWidth,
      quality,
      ROTATE_DEGRESS[rotate],
    );
    const arrayBuffer = await blobToArrayBuffer(blob);
    return arrayBuffer;
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error('error', e);

    return binary;
  }
};

export default Resizer;
