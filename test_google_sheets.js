import fs from 'fs';
import https from 'https';
import crypto from 'crypto';

const SPREADSHEET_ID = '1D5_62bPEYPbHkmR6e8JQAfloPtfxxb9FLzKkII20-SU';
const creds = JSON.parse(fs.readFileSync('google-credentials.json', 'utf8'));

function base64UrlEncode(str) {
  return Buffer.from(str)
    .toString('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}

function getAccessToken() {
  return new Promise((resolve, reject) => {
    const now = Math.floor(Date.now() / 1000);
    const header = { alg: 'RS256', typ: 'JWT' };
    const claim = {
      iss: creds.client_email,
      scope: 'https://www.googleapis.com/auth/spreadsheets',
      aud: creds.token_uri,
      exp: now + 3600,
      iat: now
    };

    const encodedHeader = base64UrlEncode(JSON.stringify(header));
    const encodedClaim = base64UrlEncode(JSON.stringify(claim));
    const signInput = `${encodedHeader}.${encodedClaim}`;

    const sign = crypto.createSign('RSA-SHA256');
    sign.update(signInput);
    sign.end();
    const signature = sign.sign(creds.private_key, 'base64')
      .replace(/=/g, '')
      .replace(/\+/g, '-')
      .replace(/\//g, '_');

    const jwt = `${signInput}.${signature}`;

    const postData = `grant_type=urn%3Aietf%3Aparams%3Aoauth%3Agrant-type%3Ajwt-bearer&assertion=${jwt}`;

    const req = https.request(creds.token_uri, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': Buffer.byteLength(postData)
      }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          if (json.access_token) {
            resolve(json.access_token);
          } else {
            reject(new Error(JSON.stringify(json)));
          }
        } catch (e) {
          reject(e);
        }
      });
    });

    req.on('error', reject);
    req.write(postData);
    req.end();
  });
}

function fetchSheetsMeta(token) {
  return new Promise((resolve, reject) => {
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}`;
    const req = https.request(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          resolve(json);
        } catch (e) {
          reject(e);
        }
      });
    });
    req.on('error', reject);
    req.end();
  });
}

async function testConnection() {
  try {
    console.log('1. Getting OAuth2 token for Service Account:', creds.client_email);
    const token = await getAccessToken();
    console.log('✅ Obtained Access Token successfully!');

    console.log('2. Fetching Google Sheet Metadata:', SPREADSHEET_ID);
    const meta = await fetchSheetsMeta(token);

    if (meta.error) {
      console.error('❌ Google Sheets API Error:', meta.error.message);
      return;
    }

    console.log('✅ Connected to Google Sheet:', meta.properties?.title);
    console.log('Available Sheets/Tabs:');
    (meta.sheets || []).forEach((s, idx) => {
      console.log(`   ${idx + 1}. [${s.properties.title}] (ID: ${s.properties.sheetId}, rows: ${s.properties.gridProperties?.rowCount}, cols: ${s.properties.gridProperties?.columnCount})`);
    });
  } catch (err) {
    console.error('❌ Test failed:', err.message);
  }
}

testConnection();
