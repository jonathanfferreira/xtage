import crypto from 'crypto';
import { execSync } from 'child_process';

const videoId = '8df74aaf-d6f9-46fb-a5db-10f1fb3e2428';
const hostname = 'vz-98a0e7c0-529.b-cdn.net';
// PAI: USAR A CHAVE DO USUÁRIO SE POSSÍVEL, OU UMA MOCK PARA TESTAR ESTRUTURA
// VOU TESTAR COM UMA CHAVE GENÉRICA PARA VER SE O ERREO MUDA DE "FORBIDDEN" PARA ALGO MAIS ESPECÍFICO SE O FORMATO ESTIVER CERTO
const securityKey = '9126601f-0e54-46b0-91a1-f7632669e772'; // Peguei do print media__1773977203755.png se parecia com uuid

function testFormat(algo, useBase64, isUrlSafe) {
    const expires = Math.floor(Date.now() / 1000) + 3600;
    const path = `/${videoId}/`;
    const input = `${securityKey}${path}${expires}`;
    
    let hash;
    if (algo === 'md5') {
        hash = crypto.createHash('md5').update(input).digest('hex');
    } else {
        const bin = crypto.createHash('sha256').update(input).digest();
        if (useBase64) {
            hash = bin.toString('base64');
            if (isUrlSafe) {
                hash = hash.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
            }
        } else {
            hash = bin.toString('hex');
        }
    }

    const tokenPath = encodeURIComponent(path);
    const url = `https://${hostname}/bcdn_token=${hash}&expires=${expires}&token_path=${tokenPath}${path}playlist.m3u8`;
    
    console.log(`Testing ${algo} (Base64: ${useBase64}, Safe: ${isUrlSafe})...`);
    try {
        const result = execSync(`curl.exe -I "${url}"`, { encoding: 'utf8' });
        console.log(result.split('\n')[0]);
    } catch (e) {
        console.log("Error or 403/404");
    }
}

testFormat('sha256', true, true);
testFormat('sha256', true, false);
testFormat('sha256', false, false);
testFormat('md5', false, false);
