import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  getSyncStatus,
  initializeSheetStructure,
  pushAllToSheets,
  pullAllFromSheets,
  ENTITY_SCHEMAS,
  getLocalEntityData,
  saveLocalEntityData
} from './src/services/googleSheetsSync.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = 3000;
const SPREADSHEET_ID = '1D5_62bPEYPbHkmR6e8JQAfloPtfxxb9FLzKkII20-SU';

const MIME_TYPES = {
  '.html': 'text/html; charset=UTF-8',
  '.js': 'application/javascript; charset=UTF-8',
  '.mjs': 'application/javascript; charset=UTF-8',
  '.css': 'text/css; charset=UTF-8',
  '.json': 'application/json; charset=UTF-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.webmanifest': 'application/manifest+json'
};

// Background Pull Interval (Fetches latest Google Sheets changes without overwriting)
let autoSyncIntervalMs = 60 * 1000;
let autoSyncTimer = null;
let lastSyncResult = null;

function startBackgroundSync() {
  if (autoSyncTimer) clearInterval(autoSyncTimer);
  autoSyncTimer = setInterval(async () => {
    try {
      await pullAllFromSheets();
    } catch (e) {
      // silent
    }
  }, autoSyncIntervalMs);
}

startBackgroundSync();

// Parse request body helper
function parseJsonBody(req) {
  return new Promise((resolve) => {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (e) {
        resolve({});
      }
    });
  });
}

function sendJson(res, statusCode, data) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=UTF-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization'
  });
  res.end(JSON.stringify(data));
}

const server = http.createServer(async (req, res) => {
  const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost:3000'}`);
  let pathname = decodeURIComponent(parsedUrl.pathname);

  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    });
    return res.end();
  }

  // ==========================================
  // REST API ENDPOINTS: GOOGLE SHEETS SYNC
  // ==========================================

  // 1. Check Google Sheets Sync Status
  if (pathname === '/api/sheets/status' && req.method === 'GET') {
    try {
      const status = await getSyncStatus();
      status.autoSyncMinutes = 1;
      status.lastSync = lastSyncResult;
      return sendJson(res, 200, status);
    } catch (err) {
      return sendJson(res, 500, { error: err.message });
    }
  }

  // 2. Initialize Structure (Tabs + Headers)
  if (pathname === '/api/sheets/init' && req.method === 'POST') {
    try {
      const result = await initializeSheetStructure();
      return sendJson(res, 200, result);
    } catch (err) {
      return sendJson(res, 500, { error: err.message });
    }
  }

  // 3. Push Live ERP Data to Google Sheets
  if (pathname === '/api/sheets/push' && req.method === 'POST') {
    try {
      const body = await parseJsonBody(req);
      const liveData = body.liveData || null;
      lastSyncResult = await pushAllToSheets(liveData);
      return sendJson(res, 200, lastSyncResult);
    } catch (err) {
      return sendJson(res, 500, { error: err.message });
    }
  }

  // 4. Pull All Data from Google Sheets to Local ERP
  if (pathname === '/api/sheets/pull' && req.method === 'POST') {
    try {
      const result = await pullAllFromSheets();
      lastSyncResult = result;
      return sendJson(res, 200, result);
    } catch (err) {
      return sendJson(res, 500, { error: err.message });
    }
  }

  // 5. Get Raw Local Entities
  if (pathname.startsWith('/api/data/') && req.method === 'GET') {
    const entityKey = pathname.replace('/api/data/', '');
    const data = getLocalEntityData(entityKey);
    return sendJson(res, 200, data);
  }

  // ==========================================
  // STATIC ASSETS & SPA ROUTING
  // ==========================================
  let filePath = path.join(__dirname, pathname);

  // Check if requested file exists
  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    const ext = path.extname(filePath).toLowerCase();
    res.writeHead(200, {
      'Content-Type': MIME_TYPES[ext] || 'application/octet-stream',
      'Access-Control-Allow-Origin': '*'
    });
    fs.createReadStream(filePath).pipe(res);
    return;
  }

  // SPA fallback to index.html
  const indexPath = path.join(__dirname, 'index.html');
  if (fs.existsSync(indexPath)) {
    res.writeHead(200, {
      'Content-Type': 'text/html; charset=UTF-8',
      'Access-Control-Allow-Origin': '*'
    });
    fs.createReadStream(indexPath).pipe(res);
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=UTF-8' });
    res.end('404 Not Found');
  }
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`\n==================================================================`);
  console.log(`🚀 [5F ERP Template] Server & Google Sheets API đang chạy tại:`);
  console.log(`   ➜ Web App:        http://localhost:${PORT}/dang-nhap`);
  console.log(`   ➜ Google Sheet:   https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/edit`);
  console.log(`   ➜ Chế độ:         TỰ ĐỘNG ĐỒNG BỘ NGẦM THỜI GIAN THỰC ⚡`);
  console.log(`==================================================================\n`);
});
