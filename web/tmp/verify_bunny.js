const crypto = require('crypto');

const securityKey = '70c8d22e-feea-414a-a8f9-559304090ec0';
const tokenPath = '/8df74aaf-d6f9-46fb-a5db-10f1fb3e2428/';
const expires = '1774066683';
const expectedHash = 'n4_iyzxZ55HDHtRi3eEQj6Yf4F6p9n79U0dKT91Qp0A';

// Format expected by our token.ts
const hashableBase = `${securityKey}${tokenPath}${expires}`;

const hash = crypto.createHash('sha256').update(hashableBase).digest('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');

console.log('Result Hash:  ', hash);
console.log('Expected Hash:', expectedHash);
console.log('Match?        ', hash === expectedHash);
