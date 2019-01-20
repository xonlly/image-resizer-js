import Resizer from '../src';

const [original, resized] = [new Image(), new Image()];

describe('test compression', () => {
  it('should be compress', () => {
    let originalBlob;
    let resizedBlob;

    document.querySelector('body').appendChild(resized);
    document.querySelector('body').appendChild(original);

    return (
      fetch(
        'https://raw.githubusercontent.com/recurser/exif-orientation-examples/master/Landscape_2.jpg',
      )
        .then(res => res.arrayBuffer())
        .then(buffer => buffer)
        .then(arrayBuffer => {
          originalBlob = new Blob([arrayBuffer]);
          return Resizer(arrayBuffer, 100, 100);
        })
        .then(arrayBuffer => {
          const blob = new Blob([arrayBuffer]);
          resizedBlob = blob;
        })

        .then(() => {
          resized.src = URL.createObjectURL(resizedBlob);
          original.src = URL.createObjectURL(originalBlob);

          // eslint-disable-next-line
          console.log(
            'resizedBlob.size',
            originalBlob.size,
            'to',
            resizedBlob.size,
            'percent:',
            resizedBlob.size * 100 / originalBlob.size,
          );

          expect(resizedBlob.size).toBeLessThan(originalBlob.size);
        })
        // .then(() => new Promise(resolve => setTimeout(() => resolve(), 2000)))
        .catch(err => console.error('coucou', err))
    );
  });

  it('should be sized', done => {
    setTimeout(() => {
      expect(resized.width).toBe(100);
      done();
    }, 100);
  });

  it('should resize by height', () => {
    let originalBlob;
    let resizedBlob;
    fetch(
      'https://raw.githubusercontent.com/recurser/exif-orientation-examples/master/Landscape_2.jpg',
    )
      .then(res => res.arrayBuffer())
      .then(buffer => buffer)
      .then(arrayBuffer => {
        originalBlob = new Blob([arrayBuffer]);
        return Resizer(arrayBuffer, { maxHeight: 50, quality: 50 });
      })
      .then(arrayBuffer => {
        const blob = new Blob([arrayBuffer]);
        resizedBlob = blob;
      })

      .then(() => {
        resized.src = URL.createObjectURL(resizedBlob);
        expect(resized.height).toBe(50)
      })
  })
});
