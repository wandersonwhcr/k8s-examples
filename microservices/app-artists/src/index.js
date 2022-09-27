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

const { name, version, description } = require('./package.json');

fastify.get('/', (request, reply) => {
  reply.status(200)
    .send({ name, version, description });
});

fastify.post('/v1/artists', require('./routes/create.js'));

module.exports = fastify;
