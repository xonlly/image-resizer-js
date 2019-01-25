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

const ROTATE_DEGREES = [0, 90, 180, 270];

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

const getCanvasForImage = (width, height) => {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
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
  options,
) => {
  if (!EXIF_TRANSFORMS[exifOrientationId]) return arrayBuffer;

  const blob = new Blob([arrayBuffer]);
  const image = await createImage(blob);

  let finalWidth = image.width
  let finalHeight = image.height
  if (options.maxWidth && finalWidth > options.maxWidth) {
    const ratio = options.maxWidth / finalWidth
    finalWidth *= ratio
    finalHeight *= ratio
  }
  if (options.maxHeight && finalHeight > options.maxHeight) {
    const ratio = options.maxHeight / finalHeight
    finalWidth *= ratio
    finalHeight *= ratio
  }

  finalWidth = Math.floor(finalWidth)
  finalHeight = Math.floor(finalHeight)

  const canvas = getCanvasForImage(finalWidth, finalHeight);

  const w = canvas.width;
  const h = canvas.height;

  if (exifOrientationId > 4 || options.rotate === 90 || options.rotate === 270) {
    const temp = canvas.width;
    canvas.width = canvas.height;
    canvas.height = temp;
  }

  const ctx = exifTransformCanvas(canvas.getContext('2d'), exifOrientationId);

  ctx.rotate(options.rotate * Math.PI / 180);
  ctx.drawImage(image, 0, 0, image.width, image.height, -w / 2, -h / 2, w, h);

  if (typeof canvas.toBlob !== 'undefined') {
    return new Promise(resolve =>
      canvas.toBlob(resolve, options.type || blob.type, options.quality / 100),
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

const Resizer = async (binary, maxWidthOrOptions = undefined, quality = 100, rotate = 0) => {
  let options
  if (typeof maxWidthOrOptions === 'object') {
    options = maxWidthOrOptions
    if (!options.quality) options.quality = 100
    options.rotate = ROTATE_DEGREES[options.rotate]
  } else {
    options = {}
    options.maxWidth = maxWidthOrOptions
    options.quality = quality
    options.rotate = ROTATE_DEGREES[rotate]
  }

  let orientation = 1;

  try {
    const metadata = await exif(binary);
    if (metadata.Orientation) orientation = metadata.Orientation.value;
  } catch (e) {
    if (e.message !== 'Invalid image format' && !options.silent) {
      // eslint-disable-next-line no-console
      console.error('get metadata error', e);
    }
  }
  try {
    const blob = await rotateAndResize(
      binary,
      orientation,
      options,
    );
    const arrayBuffer = await blobToArrayBuffer(blob);
    return arrayBuffer;
  } catch (e) {
    if (!options.silent) {
      // eslint-disable-next-line no-console
      console.error('error', e);
    }
    
    return binary;
  }
};

export default Resizer;
