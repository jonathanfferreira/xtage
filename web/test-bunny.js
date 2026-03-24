const crypto = require('crypto');

function generateToken(videoId, securityKey, userIp = "", expiresInSeconds = 3600) {
    const hostname = 'vz-98a0e7c0-529.b-cdn.net';
    const expirationTime = Math.round(Date.now() / 1000) + expiresInSeconds;
    const tokenPath = `/${videoId}/`;
    
    // Testando sem IP primeiro (mais comum)
    const hashableBase = `${securityKey}${tokenPath}${expirationTime}${userIp}`;
    
    const hash = crypto.createHash('sha256').update(hashableBase).digest('base64')
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=/g, '');

    const tokenizedUrl = `https://${hostname}${tokenPath}playlist.m3u8?token=${hash}&expires=${expirationTime}&token_path=${tokenPath}`;
    return tokenizedUrl;
}

const videoId = '737f526b-d014-4fb9-bbb4-257a06f3660d'; // Introdução
const securityKey = 'TEST_KEY'; 

console.log("URL COM IP (vazia):", generateToken(videoId, securityKey));
console.log("URL COM IP (1.2.3.4):", generateToken(videoId, securityKey, "1.2.3.4"));
