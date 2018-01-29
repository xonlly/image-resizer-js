import Resizer from '../src';

const [original, resized] = [new Image(), new Image()];

describe('test compression', () => {
  it('should be compress', done => {
    let originalBlob;
    let resizedBlob;

    document.querySelector('body').appendChild(resized);

    fetch(
      'https://raw.githubusercontent.com/recurser/exif-orientation-examples/master/Landscape_2.jpg',
    )
      .then(res => res.arrayBuffer())
      .then(buffer => buffer)
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
