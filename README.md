[![wercker status](https://app.wercker.com/status/808b3e008fb779d94fcf557592655213/s/master 'wercker status')](https://app.wercker.com/project/byKey/808b3e008fb779d94fcf557592655213)

# Image resizer and fix exif rotate

This module fix rotate and resize your image.

```js
import resizer from 'image-resizer-js';

resizer(image<Uint8Array | ArrayBuffer>, width<Number>, quality<Number 0..100>)
  .then(image<Uint8Array> => {
    // image resized
    const blob = new Blob([image]);

    image.src = blob;
  })
  .catch(err => console.error(err))
```

# Exemple

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
