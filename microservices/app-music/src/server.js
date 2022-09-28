const express = require('.');

const server = express.listen(process.env.PORT);

function handleSignal(signal) {
  console.log(`Signal Received: ${signal}`);
  server.close();
  process.exit(0);
}

process.on('SIGINT', handleSignal);
process.on('SIGTERM', handleSignal);
