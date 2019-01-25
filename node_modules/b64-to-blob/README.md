`b64toBlob(b64Data: string, contentType?: string): Blob` converts a base64
string to a Blob object [as described in this Stack Overflow post](https://stackoverflow.com/questions/16245767/creating-a-blob-from-a-base64-string-in-javascript).

Note that the `Blob` class only exists in browsers, not Node, so this package
is only meant for use in the browser and simulated browser environments, not as
part of a typical Node server.

## Example Usage

This module uses the UMD returnExports pattern to export itself for either AMD
or Node/Webpack module loading, falling back to a global browser definition if
neither are available.

### With Webpack

<!-- language: lang-sh -->

    npm install b64-to-blob

<!-- language: lang-js -->

    var b64toBlob = require('b64-to-blob');

    var contentType = 'image/png';
    var b64Data =
        'iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACN' +
        'byblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHx' +
        'gljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg==';

    var blob = b64toBlob(b64Data, contentType);

    var blobUrl = URL.createObjectURL(blob);
    window.location = blobUrl;

### Without a Build Step

<!-- language: lang-js -->

    <script src="https://unpkg.com/b64-to-blob"></script>
    <script>
        var contentType = 'image/png';
        var b64Data =
            'iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACN' +
            'byblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHx' +
            'gljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg==';

        var blob = b64toBlob(b64Data, contentType);

        var blobUrl = URL.createObjectURL(blob);
        window.location = blobUrl;
    </script>
