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

// TODO: move this on exif.js
const inkjet = {
  exif: buf =>
    new Promise((resolve, reject) =>
      exif(buf, (err, metadata) => {
        if (err) return reject(err);
        return resolve(metadata);
      }),
    ),
};

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

const createImage = binary =>
  new Promise(resolve => {
    const blob = new Blob([binary]);
    const image = new Image();

    image.src = URL.createObjectURL(blob);
    image.onload = () => resolve(image);
  });

const rotateAndResize = async (
  inkjetImage,
  exifOrientationId,
  maxWidth = 800,
) => {
  if (!EXIF_TRANSFORMS[exifOrientationId]) return inkjetImage;

  const image = await createImage(inkjetImage);
  const canvas = getCanvasForImage(inkjetImage, maxWidth, {
    width: image.width,
    height: image.height,
  });

  const w = canvas.width;
  const h = canvas.height;

  if (exifOrientationId > 4) {
    const temp = canvas.width;
    canvas.width = canvas.height;
    canvas.height = temp;
  }

  const ctx = exifTransformCanvas(canvas.getContext('2d'), exifOrientationId);

  ctx.drawImage(image, 0, 0, image.width, image.height, -w / 2, -h / 2, w, h);

  if (typeof canvas.toBlob !== 'undefined') {
    return new Promise(resolve => canvas.toBlob(resolve));
  } else if (typeof canvas.msToBlob !== 'undefined') {
    return canvas.msToBlob();
  }

  return inkjetImage;
};

const Lightening = async (binary, maxWidth = 800) => {
  try {
    const metadata = await inkjet.exif(binary);
    let orientation = 1;
    if (metadata.Orientation) orientation = metadata.Orientation.value;

    return await rotateAndResize(binary, orientation, maxWidth);
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error('error', e);
    return binary;
  }
};

export default Lightening;
