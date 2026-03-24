const crypto = require('crypto');

const expectedHash = 'n4_iyzxZ55HDHtRi3eEQj6Yf4F6p9n79U0dKT91Qp0A';
const key = '70c8d22e-feea-414a-a8f9-559304090ec0';
const expires = '1774066683';
const videoId = '8df74aaf-d6f9-46fb-a5db-10f1fb3e2428';

function generate(baseString) {
    const hash = crypto.createHash('sha256').update(baseString).digest('base64')
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=/g, '');
    if (hash === expectedHash) {
        console.log(`[SUCCESS] BINGO! Base string was: "${baseString}"`);
        process.exit(0);
    }
}

// Typical Direct Bunny Stream logic: key + videoId + expires
generate(`${key}${videoId}${expires}`);
generate(`${key}/${videoId}/${expires}`);
generate(`${key}${videoId}${expires}0`); // with user ip theoretically empty = 0?
generate(`${key}${videoId}${expires} `);

// What if the Bunny formula for stream is exactly TokenAuthenticationKey?
// Wait, is it possible Bunny's own dashboard generates the token using the URL Path `/bcdn_token=...`?
// No, the url token is what we want.
// Let's brute force all kinds of concatenations of the 3 fragments:
const fragments = [key, videoId, expires];

function permute(arr, str = '') {
  if (arr.length === 0) {
    generate(str);
    generate(str + ' ');
  }
  for (let i = 0; i < arr.length; i++) {
    const rest = arr.slice(0, i).concat(arr.slice(i + 1));
    permute(rest, str + arr[i]);
    permute(rest, str + arr[i] + '/');
  }
}

permute(fragments);
generate(`${key}${videoId}${expires}`);
// also try MD5 just in case
function generateMD5(baseString) {
    const hash = crypto.createHash('md5').update(baseString).digest('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
    if (hash === expectedHash) { console.log(`BINGO MD5: ${baseString}`); }
}
generateMD5(`${key}${videoId}${expires}`);
generateMD5(`${key}/${videoId}/${expires}`);
console.log("No match found in stream permutations.");
