import Resizer from 'index.js';
import image from '../tests/assets/cat.jpeg';

var input = document.querySelector('input');
var preview = document.querySelector('.preview');

input.style.opacity = 0;

var reader = new FileReader();

reader.onload = e => {
  // const unit = new Uint8Array(reader.result);
  console.log(
    'e.target.result',
    convertBinaryStringToUint8Array(e.target.result),
  );
  Resizer(convertBinaryStringToUint8Array(e.target.result), 10, 1000)
    .then(x => console.log('x', x))
    .catch(err => console.log('error', err));
};

const convertBinaryStringToUint8Array = bStr => {
  var i,
    len = bStr.length,
    u8_array = new Uint8Array(len);
  for (var i = 0; i < len; i++) {
    u8_array[i] = bStr.charCodeAt(i);
  }
  return u8_array;
};

const updateImageDisplay = () => {
  var curFiles = input.files;

  console.log('curFiles', curFiles);
  Object.keys(curFiles).forEach(file => {
    reader.readAsBinaryString(curFiles[file]);
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
