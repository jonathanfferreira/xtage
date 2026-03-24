const crypto = require('crypto');

const expectedHash = 'n4_iyzxZ55HDHtRi3eEQj6Yf4F6p9n79U0dKT91Qp0A';
const expires = '1774066683';
const videoId = '8df74aaf-d6f9-46fb-a5db-10f1fb3e2428';
const tokenPath = `/${videoId}/`;

function check(base) {
    const hash = crypto.createHash('sha256').update(base).digest('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
    if (hash === expectedHash) {
        console.log("FOUND IT! Base string is:", base);
        process.exit(0);
    }
}

// undefined key
check(`undefined${tokenPath}${expires}`);
// null key
check(`null${tokenPath}${expires}`);
// empty string key
check(`${tokenPath}${expires}`);

// other fallback keys
const key1 = 'd708b8cf-4260-4954-93f540d86774-f5be-4a1e';
const key2 = '70c8d22e-feea-414a-a8f9-559304090ec0';
const key3 = '0675b56b-22d1-4df1-943c-561cfa315ce6ef778fc5-96d5-4ab4-8f42-375125c88582';
// maybe with user IP?
const ips = ['127.0.0.1', '::1', 'localhost', ''];
for (const ip of ips) {
    check(`${key1}${tokenPath}${expires}${ip}`);
    check(`${key2}${tokenPath}${expires}${ip}`);
    check(`${key3}${tokenPath}${expires}${ip}`);
    check(`undefined${tokenPath}${expires}${ip}`);
}

console.log("No magical match.");
