const crypto = require('crypto');

const securityKey = '70c8d22e-feea-414a-a8f9-559304090ec0';
const api_key = '0675b56b-22d1-4df1-943c-561cfa315ce6ef778fc5-96d5-4ab4-8f42-375125c88582';
const api_key2 = 'd708b8cf-4260-4954-93f540d86774-f5be-4a1e';
const videoId = '8df74aaf-d6f9-46fb-a5db-10f1fb3e2428';
const expires = '1774066683';
const expectedHash = 'n4_iyzxZ55HDHtRi3eEQj6Yf4F6p9n79U0dKT91Qp0A';

function checkToken(name, key, path) {
    const hashableBase = `${key}${path}${expires}`;
    const hash = crypto.createHash('sha256').update(hashableBase).digest('base64')
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=/g, '');
    if (hash === expectedHash) {
        console.log(`BINGO! Match found: ${name} -> ${hashableBase}`);
    }
}

function tryVariations(keyName, key) {
    // Variations of path
    checkToken(`${keyName} - /id/`, key, `/${videoId}/`);
    checkToken(`${keyName} - /id`, key, `/${videoId}`);
    checkToken(`${keyName} - id/`, key, `${videoId}/`);
    checkToken(`${keyName} - id`, key, `${videoId}`);
    
    // Also userIp? Usually empty. Let's try maybe without token path at all?
    const base2 = `${key}${expires}`;
    if (crypto.createHash('sha256').update(base2).digest('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '') === expectedHash) {
        console.log(`BINGO! No path -> ${base2}`);
    }
}

tryVariations("TokenKey", securityKey);
tryVariations("APIKey", api_key);
tryVariations("APIKey2", api_key2);

// What if the token generation formula is securityKey + path + expires + (optional IPs/ect)? 
// Let's also check if userIp is expected to be part of the hash...
// If no BINGO is printed, the TokenKey we have is probably NOT the one used in the dashboard.
console.log("Done checking variations. If no BINGO above, the key doesn't match.");
