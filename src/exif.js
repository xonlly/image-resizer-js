import { ExifReader } from './exifReader';

export default function(buf, cb) {
  try {
    const exif = new ExifReader();
    exif.load(buf);

    const metadata = exif.getAllTags();

    cb(null, metadata);
  } catch (err) {
    if (err.message === 'No Exif data') {
      cb(null, {});
    } else {
      cb(err);
    }
  }
}
