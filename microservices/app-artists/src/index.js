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

fastify.get('/v1/artists', require('./routes/fetch.js'));
fastify.post('/v1/artists', require('./routes/create.js'));
fastify.get('/v1/artists/:artistId', require('./routes/find.js'));
fastify.put('/v1/artists/:artistId', require('./routes/update.js'));
fastify.delete('/v1/artists/:artistId', require('./routes/delete.js'));

fastify.setErrorHandler((error, request, reply) => {
  fastify.log.error(error);

  if (error.validation) {
    reply.status(422)
      .send(error.validation);
    return;
  }

  if (error.isAxiosError) {
    reply.status(error.response.status)
      .send(error.response.data);
    return;
  }

  reply.status(500)
    .send();
});

module.exports = fastify;
