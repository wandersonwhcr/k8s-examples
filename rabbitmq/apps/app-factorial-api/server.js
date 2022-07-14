const bson = require('bson');
const uuid = require('uuid');

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

fastify.register(require('fastify-amqp'), {
  hostname: process.env.RABBITMQ_HOST,
  port: process.env.RABBITMQ_PORT,
  username: process.env.RABBITMQ_USERNAME,
  password: process.env.RABBITMQ_PASSWORD,
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
  handler: function (req, reply) {
    const id = uuid.v4();

    this.amqp.channel.sendToQueue(
      'factorials',
      bson.serialize(req.body),
      { headers: { 'x-resource-id': id } }
    );

    reply.status(202)
      .header('x-resource-id', id)
      .header('location', '/factorials/' + id)
      .send({ id });
  },
});

fastify.setErrorHandler(function (error, req, reply) {
  this.log.error(error);

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
