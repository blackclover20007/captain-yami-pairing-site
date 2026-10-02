import { createServer } from 'node:http';
import { createReadStream, existsSync, statSync } from 'node:fs';
import { extname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('.', import.meta.url));
const port = Number(process.env.PORT || 3000);
const mime = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

function sendJson(res, status, payload) {
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store'
  });
  res.end(JSON.stringify(payload));
}

function serveFile(res, pathname) {
  const safePath = normalize(pathname).replace(/^\.\.(\/|\\|$)/, '');
  const requested = join(root, safePath === '/' ? 'index.html' : safePath);
  if (!requested.startsWith(root) || !existsSync(requested) || !statSync(requested).isFile()) {
    const fallback = join(root, 'index.html');
    res.writeHead(200, { 'Content-Type': mime['.html'] });
    return createReadStream(fallback).pipe(res);
  }
  res.writeHead(200, {
    'Content-Type': mime[extname(requested)] || 'application/octet-stream',
    'Cache-Control': extname(requested) === '.html' ? 'no-cache' : 'public, max-age=3600'
  });
  createReadStream(requested).pipe(res);
}

const server = createServer((req, res) => {
  const url = new URL(req.url || '/', `http://${req.headers.host || 'localhost'}`);
  if (url.pathname === '/health') return sendJson(res, 200, { ok: true, service: 'captain-yami-pairing-site' });
  if (url.pathname === '/api/bridge/status') {
    return sendJson(res, 200, {
      available: false,
      mode: 'frontend-preview',
      message: 'Connect a Baileys bridge to enable real WhatsApp pairing and session delivery.'
    });
  }
  if (url.pathname === '/api/pairing/request' && req.method === 'POST') {
    return sendJson(res, 501, {
      ok: false,
      code: 'BRIDGE_NOT_CONFIGURED',
      message: 'The UI is ready, but the supplied bot does not expose a pairing API yet.'
    });
  }
  serveFile(res, url.pathname);
});

server.listen(port, '0.0.0.0', () => {
  console.log(`Captain Yami pairing site listening on 0.0.0.0:${port}`);
});
