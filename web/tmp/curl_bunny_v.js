const crypto = require('crypto');
function generateBunnyTokenizedUrl(videoId, expiresInSeconds = 21600) {
    const hostname = 'vz-98a0e7c0-529.b-cdn.net';
    const securityKey = '70c8d22e-feea-414a-a8f9-559304090ec0';
    const expirationTime = Math.round(Date.now() / 1000) + expiresInSeconds;
    const tokenPath = `/${videoId}/`;
    const hashableBase = `${securityKey}${tokenPath}${expirationTime}`;
    const hash = crypto.createHash('sha256').update(hashableBase).digest('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
    const encodedTokenPath = encodeURIComponent(tokenPath);
    const url = `https://${hostname}/bcdn_token=${hash}&expires=${expirationTime}&token_path=${encodedTokenPath}${tokenPath}playlist.m3u8`;
    return url;
}
const url = generateBunnyTokenizedUrl('8df74aaf-d6f9-46fb-a5db-10f1fb3e2428');
const { execSync } = require('child_process');
try {
    const output = execSync(`curl -v "${url}" 2>&1`, {encoding: 'utf8'});
    console.log(output);
} catch(e) {
    console.error(e.stdout ? e.stdout.toString() : e);
}
