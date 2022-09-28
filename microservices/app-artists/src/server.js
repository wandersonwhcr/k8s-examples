const opentelemetry = require('@opentelemetry/sdk-node');
const { OTLPTraceExporter } = require('@opentelemetry/exporter-trace-otlp-http');
const { HttpInstrumentation } = require('@opentelemetry/instrumentation-http');

const sdk = new opentelemetry.NodeSDK({
  traceExporter: new OTLPTraceExporter(),
  instrumentations: [
    new HttpInstrumentation(),
  ],
});

sdk.start();

// -------------------------------------------------------------------------------------------------

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
