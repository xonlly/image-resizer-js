import originalInkjet from 'inkjet';

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

const inkjet = {
  decode: buf =>
    new Promise((resolve, reject) =>
      originalInkjet.decode(buf, (err, decoded) => {
        if (err) return reject(err);
        return resolve(decoded);
      }),
    ),
  encode: (buf, options) =>
    new Promise((resolve, reject) =>
      originalInkjet.encode(buf, options, (err, encoded) => {
        if (err) return reject(err);
        return resolve(encoded);
      }),
    ),
  exif: buf =>
    new Promise((resolve, reject) =>
      originalInkjet.exif(buf, (err, metadata) => {
        if (err) return reject(err);
        return resolve(metadata);
      }),
    ),
};

const transformCanvas = (ctx, degrees = 0, flip = false) => {
  ctx.translate(ctx.canvas.width / 2, ctx.canvas.height / 2);
  ctx.rotate(degrees);
  if (flip) {
    ctx.scale(-1, 1);
  }
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
    console.log('bloby ?', blob, binary);
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

  console.log('inkjetImage', inkjetImage);

  const image = await createImage(inkjetImage);
  const canvas = getCanvasForImage(inkjetImage, maxWidth, {
    width: image.width,
    height: image.height,
  });
  console.log('canvas ok ?');
  console.log('image ?', image);

  console.log('image.width', image.width, image.height);

  document.querySelector('body').appendChild(image);

  const w = canvas.width;
  const h = canvas.height;

  document.querySelector('body').appendChild(canvas);

  if (exifOrientationId > 4) {
    const temp = canvas.width;
    canvas.width = canvas.height;
    canvas.height = temp;
  }

  const ctx = exifTransformCanvas(canvas.getContext('2d'), exifOrientationId);

  ctx.drawImage(
    image,
    0,
    0,
    image.width, // inkjetImage.width,
    image.height, // inkjetImage.height,
    -w / 2,
    -h / 2,
    w,
    h,
  );

  if (typeof canvas.toBlob !== 'undefined') {
    return new Promise(resolve => canvas.toBlob(resolve));
  } else if (typeof canvas.msToBlob !== 'undefined') {
    return canvas.msToBlob();
  }

  return inkjetImage;
};

const Lightening = async (binary, quality = 100, maxWidth = 800) => {
  try {
    // const { data: decodedData, width, height } = await inkjet.decode(binary);
    // console.log('data', decodedData, width, height);
    // const imageEncoded = await inkjet.encode(decodedData, {
    //   quality,
    //   width,
    //   height,
    // });

    const metadata = await inkjet.exif(binary);
    console.log('metadata', metadata);
    let orientation = 1;
    if (metadata.Orientation) orientation = metadata.Orientation.value;

    const image = await rotateAndResize(binary, orientation, maxWidth);
    return image;
  } catch (e) {
    console.error('e', e);
    return binary;
  }
};

export default Lightening;
