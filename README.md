# Image resizer and fix exif rotate

This module fix rotate and resize your image.

```js
import resizer from 'image-resizer-js';

resizer(image<Uint8Array>, width<Number>)
  .then(image<Uint8Array> => {
    // image resized
    const blob = new Blob([image]);

    image.src = blob;
  })
  .catch(err => console.error(err))
```
