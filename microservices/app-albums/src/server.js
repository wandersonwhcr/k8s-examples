const fastify = require('.');

fastify.listen({ host: '0.0.0.0', port: process.env.PORT })
  .catch((error) => {
    fastify.log.fatal(error);
    process.exit(1);
  });

function handleSignal(signal) {
  fastify.log.info(`Signal Received: ${signal}`);
  process.exit(0);
}

process.on('SIGINT', handleSignal);
process.on('SIGTERM', handleSignal);
