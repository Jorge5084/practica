const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');

// Solo se publican estos archivos. El código del servidor queda fuera del sitio.
const files = {
  '/': ['index.html', 'text/html; charset=utf-8'],
  '/index.html': ['index.html', 'text/html; charset=utf-8'],
  '/styles.css': ['styles.css', 'text/css; charset=utf-8'],
  '/app.js': ['app.js', 'text/javascript; charset=utf-8']
};

http.createServer((req, res) => {
  if (!['GET', 'HEAD'].includes(req.method)) {
    res.writeHead(405, { Allow: 'GET, HEAD' });
    return res.end();
  }
  let pathname;
  try { pathname = new URL(req.url, 'http://localhost').pathname; }
  catch { res.writeHead(400); return res.end(); }
  const file = Object.hasOwn(files, pathname) ? files[pathname] : null;
  if (!file) { res.writeHead(404); return res.end('No encontrado'); }
  fs.readFile(path.join(__dirname, 'public', file[0]), (error, content) => {
    if (error) { res.writeHead(500); return res.end('No se pudo cargar el archivo'); }
    res.writeHead(200, {
      'Content-Type': file[1],
      'X-Content-Type-Options': 'nosniff',
      'Content-Security-Policy': "default-src 'self'; style-src 'self'; script-src 'self'; object-src 'none'; base-uri 'self'; frame-ancestors 'none'"
    });
    res.end(req.method === 'HEAD' ? undefined : content);
  });
}).listen(process.env.PORT || 3000, '0.0.0.0', () => {
  console.log(`Tareas disponible en http://localhost:${process.env.PORT || 3000}`);
});
