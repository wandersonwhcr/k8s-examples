const http = require('http');
const process = require('process');

const server = http.createServer((req, res) => {
  res.writeHead(200);
  res.end('Hello, World');
});

server.listen(process.env.PORT, '0.0.0.0', () => {
  console.log(new Date(), 'Server Started');
});

function handler() {
  process.exit(0);
}

process.on('SIGINT', handler);
process.on('SIGTERM', handler);
