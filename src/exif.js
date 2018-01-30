import { ExifReader } from './exifReader';

export default buf =>
  new Promise((resolve, reject) => {
    try {
      const exif = new ExifReader();
      exif.load(buf);
      resolve(exif.getAllTags());
    } catch (err) {
      if (err.message === 'No Exif data') {
        resolve({});
      } else {
        reject(err);
      }
    }
  });
