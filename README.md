[![wercker status](https://app.wercker.com/status/808b3e008fb779d94fcf557592655213/s/master 'wercker status')](https://app.wercker.com/project/byKey/808b3e008fb779d94fcf557592655213)

[![NPM](https://nodei.co/npm/image-resizer-js.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/image-resizer-js/)
[![NPM](https://nodei.co/npm-dl/image-resizer-js.png?months=1)](https://nodei.co/npm/image-resizer-js/)

# Image resizer and fix exif rotate

This module fix rotate and resize your image.

```js
import resizer from 'image-resizer-js';

resizer(image<Uint8Array | ArrayBuffer>, width<Number>, quality<Number 0..100>)
  .then(image<ArrayBuffer> => {
    // image resized
    const blob = new Blob([image]);

    image.src = blob;
  })
  .catch(err => console.error(err))
```

# Exemple

From a fetched image

```js
import resizer from 'image-resizer-js';

fetch('my-image.jpg')
  .then(res => res.arrayBuffer())
  .then(buffer => resizer(buffer, undefined, 50))
  .then(buffer => {
    const blob = new Blob([buffer]);
    const image = new Image():

    image.src = URL.createObjectURL(blob);

    // ...
  })
```
