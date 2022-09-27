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

fastify.register(require('@fastify/mongodb'), {
  forceClose: true,
  url: process.env.MONGO_URL,
  database: process.env.MONGO_DATABASE,
});

const { name, version, description } = require('./package.json');

fastify.get('/', (request, reply) => {
  reply.status(200)
    .send({ name, version, description });
});

fastify.post('/v1/artists', require('./routes/create.js'));
fastify.get('/v1/artists/:artistId', require('./routes/find.js'));

module.exports = fastify;
