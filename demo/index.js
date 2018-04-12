import Resizer from 'index.js';
import image from '../tests/assets/cat.jpeg';

var input = document.querySelector('input');
var preview = document.querySelector('.preview');

input.style.opacity = 0;

var reader = new FileReader();
var imageGetted = false;

const RR = (img, rotate = undefined) => {
  Resizer(img, undefined, 100, rotate)
    .then(x => {
      const blob = new Blob([x]);

      const newImage = new Image();
      newImage.src = URL.createObjectURL(blob);

      preview.appendChild(newImage);
    })
    .catch(err => console.log('error', err));
};

document.getElementById('rotate').addEventListener('change', e => {
  return RR(imageGetted, e.target.value);
});

reader.onload = e => {
  // const unit = new Uint8Array(reader.result);
  console.log('e.target.result', e.target.result);
  imageGetted = e.target.result;
  RR(imageGetted);
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
