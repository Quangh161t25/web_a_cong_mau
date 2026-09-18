import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {
  getSyncStatus,
  initializeSheetStructure,
  pushAllToSheets,
  pullAllFromSheets,
  getLocalEntityData
} from './src/services/googleSheetsSync.js';

// Background Pull Interval (Fetches latest Google Sheets changes)
let autoSyncTimer: any = null;
let lastSyncResult: any = null;

function startBackgroundSync() {
  if (autoSyncTimer) clearInterval(autoSyncTimer);
  autoSyncTimer = setInterval(async () => {
    try {
      await pullAllFromSheets();
    } catch (e) {
      // silent
    }
  }, 60000);
}

startBackgroundSync();

function googleSheetsPlugin() {
  return {
    name: 'google-sheets-api',
    configureServer(server: any) {
      server.middlewares.use(async (req: any, res: any, next: any) => {
        const url = new URL(req.url || '/', `http://${req.headers.host || 'localhost:3000'}`);
        const pathname = decodeURIComponent(url.pathname);

        const sendJson = (statusCode: number, data: any) => {
          res.writeHead(statusCode, {
            'Content-Type': 'application/json; charset=UTF-8',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization'
          });
          res.end(JSON.stringify(data));
        };

        if (req.method === 'OPTIONS') {
          res.writeHead(204, {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization'
          });
          return res.end();
        }

        const parseBody = (): Promise<any> => {
          return new Promise((resolve) => {
            let body = '';
            req.on('data', (chunk: any) => body += chunk);
            req.on('end', () => {
              try {
                resolve(body ? JSON.parse(body) : {});
              } catch (e) {
                resolve({});
              }
            });
          });
        };

        // 1. Status
        if (pathname === '/api/sheets/status' && req.method === 'GET') {
          try {
            const status: any = await getSyncStatus();
            status.autoSyncMinutes = 1;
            status.lastSync = lastSyncResult;
            return sendJson(200, status);
          } catch (err: any) {
            return sendJson(500, { error: err.message });
          }
        }

        // 2. Init
        if (pathname === '/api/sheets/init' && req.method === 'POST') {
          try {
            const result = await initializeSheetStructure();
            return sendJson(200, result);
          } catch (err: any) {
            return sendJson(500, { error: err.message });
          }
        }

        // 3. Push
        if (pathname === '/api/sheets/push' && req.method === 'POST') {
          try {
            const body = await parseBody();
            lastSyncResult = await pushAllToSheets(body.liveData || null);
            return sendJson(200, lastSyncResult);
          } catch (err: any) {
            return sendJson(500, { error: err.message });
          }
        }

        // 4. Pull
        if (pathname === '/api/sheets/pull' && req.method === 'POST') {
          try {
            const result = await pullAllFromSheets();
            lastSyncResult = result;
            return sendJson(200, result);
          } catch (err: any) {
            return sendJson(500, { error: err.message });
          }
        }

        // 5. Local data
        if (pathname.startsWith('/api/data/') && req.method === 'GET') {
          const entityKey = pathname.replace('/api/data/', '');
          const data = getLocalEntityData(entityKey);
          return sendJson(200, data);
        }

        next();
      });
    }
  };
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), googleSheetsPlugin()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000,
    open: false,
    host: true
  },
});
