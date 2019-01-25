[![wercker status](https://app.wercker.com/status/808b3e008fb779d94fcf557592655213/s/master 'wercker status')](https://app.wercker.com/project/byKey/808b3e008fb779d94fcf557592655213)

[![NPM](https://nodei.co/npm/image-resizer-js.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/image-resizer-js/)
[![NPM](https://nodei.co/npm-dl/image-resizer-js.png?months=1)](https://nodei.co/npm/image-resizer-js/)

# Image resizer and fix exif rotate

This module fix rotate and resize your image.

```js
import resizer from 'image-resizer-js';

resizer(image<Uint8Array | ArrayBuffer>, maxWidth<Number>, quality<Number 0..100>, rotate<Number 0..3>)
  .then(image<ArrayBuffer> => {
    // image resized
    const blob = new Blob([image]);

    image.src = blob;
  })
  .catch(err => console.error(err))
```

Or with more options...

```js
import resizer from 'image-resizer-js';

const options = {
  maxWidth: <Number | undefined>,
  maxHeight: <Number | undefined>,
  quality: <Number 0..100 | undefined>,
  rotate: <Number 0..3 | undefined>,
  type: <String>,
  silent: <Boolean>
}

resizer(image<Uint8Array | ArrayBuffer>, options)
  .then(image<ArrayBuffer> => {
    // image resized
    const blob = new Blob([image]);

    image.src = blob;
  })
  .catch(err => console.error(err))
```

Where the `options.silent` is active, no logs is return if you have an error or other.

Where the `options.type` is the mime type of the resulting image. The mime type defaults to `image/png` so you
may want to specify `images/jpeg`.

# Example

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
