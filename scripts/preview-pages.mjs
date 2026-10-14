// Local check of the production build under a GitHub Pages-style subdirectory.
import http from 'node:http';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
const root = path.resolve('dist');
const types = { '.html':'text/html', '.js':'text/javascript', '.css':'text/css', '.png':'image/png', '.mp3':'audio/mpeg', '.json':'application/json' };
http.createServer(async (request, response) => {
  try {
    const url = new URL(request.url, 'http://localhost');
    if (!url.pathname.startsWith('/marul/')) { response.writeHead(404).end(); return; }
    const relative = decodeURIComponent(url.pathname.slice('/marul/'.length)) || 'index.html';
    const target = path.resolve(root, relative);
    if (!target.startsWith(root + path.sep)) { response.writeHead(403).end(); return; }
    const body = await readFile(target);
    response.writeHead(200, { 'Content-Type': types[path.extname(target)] || 'application/octet-stream', 'Cache-Control':'no-store' });
    response.end(body);
  } catch { response.writeHead(404).end(); }
}).listen(5189, '127.0.0.1', () => console.log('http://127.0.0.1:5189/marul/'));
