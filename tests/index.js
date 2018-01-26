import Resizer from '../src';
import image from './assets/exif-orientation-examples/Landscape_2.jpg';

const convertBinaryStringToUint8Array = bStr => {
  const len = bStr.length;
  const u8Array = new Uint8Array(len);

  // eslint-disable-next-line
  for (var i = 0; i < len; i++) {
    u8Array[i] = bStr.charCodeAt(i);
  }
  return u8Array;
};

const [original, resized] = [new Image(), new Image()];

describe('test compression', () => {
  it('should be compress', done => {
    let originalBlob;
    let resizedBlob;

    document.querySelector('body').appendChild(resized);

    Promise.resolve()
      .then(() => {
        return convertBinaryStringToUint8Array(
          atob(image.replace('data:', '').split(',')[1]),
        );
      })
      .then(uintArray => {
        originalBlob = new Blob([uintArray]);
        return Resizer(uintArray, 100);
      })
      .then(uintArray => {
        const blob = new Blob([uintArray]);
        resizedBlob = blob;
      })

      .then(() => {
        resized.src = URL.createObjectURL(resizedBlob);
        original.src = URL.createObjectURL(originalBlob);

        // eslint-disable-next-line
        console.log('resizedBlob.size', resizedBlob.size, originalBlob.size);
        expect(resizedBlob.size).toBeLessThan(originalBlob.size);
      })
      // .then(() => new Promise(resolve => setTimeout(() => resolve(), 2000)))
      .then(() => done())
      .catch(err => console.error('coucou', err));
  });

  it('should be sized', done => {
    setTimeout(() => {
      expect(resized.width).toBe(100);
      done();
    }, 100);
  });
});
