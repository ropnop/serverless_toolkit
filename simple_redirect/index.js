// taken from Now's examples: https://github.com/now-examples/redirect

const { createServer } = require('http');

if (!process.env.REDIRECT_URL) {
  throw new Error('Must provide REDIRECT_URL environment variable')
}

const REDIRECT_URL = process.env.REDIRECT_URL.replace(/\/$/, '') + '/'
const STATUS = parseInt(process.env.STATUS, 10) || 301

createServer((req, res) => {
  const Location = REDIRECT_URL;
  res.writeHead(STATUS, { Location });
  res.end();
}).listen(3000);
