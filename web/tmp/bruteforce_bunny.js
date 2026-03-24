const crypto = require('crypto');

const expectedHash = 'n4_iyzxZ55HDHtRi3eEQj6Yf4F6p9n79U0dKT91Qp0A';
const key = '70c8d22e-feea-414a-a8f9-559304090ec0';
const expires = '1774066683';
const videoId = '8df74aaf-d6f9-46fb-a5db-10f1fb3e2428';

const pathsToTry = [
    `/${videoId}/`,
    `/${videoId}`,
    `${videoId}/`,
    `${videoId}`,
    `/${videoId}/playlist.m3u8`,
    `/${videoId}/thumbnail.jpg`,
    `/${videoId}/preview.webp`,
    `/%2F${videoId}%2F`,
    `%2F${videoId}%2F`
];

// In standard BunnyCDN Token Auth, they can add User IP limit, or default to ''.
const ips = ['', '192.168.0.1', '127.0.0.1'];

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

for (const p of pathsToTry) {
    for (const ip of ips) {
        // Bunny signature standard: SecurityKey + Path + Expires(optional) + IP(optional)
        generate(`${key}${p}${expires}${ip}`);
        generate(`${key}${p}${expires}`);
        
        // Maybe different order?
        generate(`${key}${expires}${p}${ip}`);
        generate(`${expires}${p}${key}`);
        generate(`${key}${p}`);
    }
}

console.log("No match found in advanced permutations.");
