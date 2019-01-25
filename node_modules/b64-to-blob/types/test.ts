import b64ToBlob from 'b64-to-blob';

// $ExpectType Blob
b64ToBlob('');

// $ExpectType Blob
b64ToBlob('aGVsbG8gd29ybGQ=');

// $ExpectType Blob
b64ToBlob('', 'text/plain');

// $ExpectError
b64ToBlob();

// $ExpectError
b64ToBlob('', true);

// $ExpectError
b64ToBlob(new Blob());

// $ExpectError
b64ToBlob('', 'text/plain', 'text/plain');
