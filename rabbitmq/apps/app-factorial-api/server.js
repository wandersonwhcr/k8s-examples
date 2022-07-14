const fastify = require('fastify')({
  logger: true,
  ajv: {
    customOptions: {
      allErrors: true,
      coerceTypes: false,
      strict: false,
    },
  },
});

fastify.post('/factorials', {
  schema: {
    body: {
      type: 'object',
      required: ['number'],
      additionalProperties: false,
      properties: {
        number: { type: 'integer' },
      },
    },
  },
  handler: (req, reply) => {
    console.log(req.body);
    reply.send({});
  },
});

fastify.setErrorHandler((error, req, reply) => {
  fastify.log.error(error);

  if (error.validation) {
    reply.status(422)
      .send(error.validation);
    return;
  }

  reply.status(500)
    .send();
});

fastify.listen({ host: "0.0.0.0", port: process.env.PORT });

process.on('SIGINT', () => fastify.close());
process.on('SIGTERM', () => fastify.close());
