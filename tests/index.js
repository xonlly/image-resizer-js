import toBuffer from 'blob-to-buffer';
import Resizer from '../src/index.js';
import image from './assets/cat.jpeg';

window.__karma__.setupContext(window);

let imageOriginal = new Image();
let imageResized = new Image();

if (document) {
  imageOriginal.style = 'width: 300px';
  imageResized.style = 'width: 300px';

  document.querySelector('body').appendChild(imageOriginal);
  document.querySelector('body').appendChild(imageResized);
}

function blobToUint8Array(b) {
  var uri = URL.createObjectURL(b),
    xhr = new XMLHttpRequest(),
    i,
    ui8;

  xhr.open('GET', uri, false);
  xhr.send();

  URL.revokeObjectURL(uri);

  ui8 = new Uint8Array(xhr.response.length);

  for (i = 0; i < xhr.response.length; ++i) {
    ui8[i] = xhr.response.charCodeAt(i);
  }

  return ui8;
}

describe('test compression', () => {
  it('should be compress', done => {
    fetch(image)
      .then(res => res.blob())
      .then(blob => blobToUint8Array(blob))
      .then(binary => {
        // toBuffer(blob, (err, buff) => {
        //   Resizer(buff, 10, 10).then(x => {});
        // });
        // console.log('blob', binary);
        if (document) {
          // imageOriginal.src = URL.createObjectURL(blob);
        }
        return Resizer(binary, 10, 10);
      })
      .then(resized => {
        //console.log('resized', resized);

        if (document) {
          // imageResized.src = URL.createObjectURL(resized);
        }
      })
      //  .then(() => new Promise(resolve => setTimeout(() => resolve(), 2000)))
      .then(() => done())
      .catch(err => console.error('coucou', err));
  });
});
