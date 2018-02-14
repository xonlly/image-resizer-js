import Resizer from 'index.js';
import image from '../tests/assets/cat.jpeg';

var input = document.querySelector('input');
var preview = document.querySelector('.preview');

input.style.opacity = 0;

var reader = new FileReader();

reader.onload = e => {
  // const unit = new Uint8Array(reader.result);
  console.log('e.target.result', e.target.result);
  Resizer(e.target.result, 200, 100)
    .then(x => {
      const blob = new Blob([x]);

      const newImage = new Image();
      newImage.src = URL.createObjectURL(blob);

      console.log('v', blob);

      preview.appendChild(newImage);
    })
    .catch(err => console.log('error', err));
};

const updateImageDisplay = () => {
  const curFiles = input.files;

  console.log('curFiles', curFiles);
  Object.keys(curFiles).forEach(file => {
    reader.readAsArrayBuffer(curFiles[file]);
  });

  console.log('cur', curFiles);
};

input.addEventListener('change', updateImageDisplay);

let imageOriginal = new Image();
let imageResized = new Image();

if (document) {
  imageOriginal.style = 'width: 300px';
  imageResized.style = 'width: 300px';

  document.querySelector('body').appendChild(imageOriginal);
  document.querySelector('body').appendChild(imageResized);
}

// function blobToUint8Array(b) {
//   var uri = URL.createObjectURL(b),
//     xhr = new XMLHttpRequest(),
//     i,
//     ui8;

//   xhr.open('GET', uri, false);
//   xhr.send();

//   URL.revokeObjectURL(uri);

//   ui8 = new Uint8Array(xhr.response.length);

//   for (i = 0; i < xhr.response.length; ++i) {
//     ui8[i] = xhr.response.charCodeAt(i);
//   }

//   return ui8;
// }

// fetch(image)
//   .then(res => res.blob())
//   // .then(blob => blobToUint8Array(blob))
//   .then(blob => {
//     // toBuffer(blob, (err, buff) => {
//     //   Resizer(buff, 10, 10).then(x => {});
//     // });
//     // console.log('blob', binary);
//     if (document) {
//       imageOriginal.src = URL.createObjectURL(blob);
//     }
//     return Resizer(blob, 10, 10);
//   })
//   .then(resized => {
//     //console.log('resized', resized);

//     if (document) {
//       imageResized.src = URL.createObjectURL(resized);
//     }
//   })
//   //  .then(() => new Promise(resolve => setTimeout(() => resolve(), 2000)))
//   .catch(err => console.error('coucou', err));
