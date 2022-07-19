const aws = require('aws-sdk');
const bson = require('bson');
const uuid = require('uuid');

const s3 = new aws.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  endpoint: process.env.AWS_ENDPOINT,
  s3ForcePathStyle: true,
});

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

    this.amqp.channel.publish(
      process.env.RABBITMQ_EXCHANGE,
      'factorial',
      bson.serialize(req.body),
      { headers: { 'x-resource-id': id } }
    );

    reply.status(202)
      .header('x-resource-id', id)
      .header('location', '/factorials/' + id)
      .send({ id });
  },
});

fastify.get('/factorials/:id', {
  schema: {
    params: {
      type: 'object',
      required: ['id'],
      additionalProperties: false,
      properties: {
        id: { type: 'string', format: 'uuid' },
      },
    }
  },
  handler: async function (req, reply) {
    const data = await s3.getObject({ Bucket: process.env.AWS_BUCKET, Key: req.params.id })
      .promise();

    reply.status(200)
      .header('content-type', data.ContentType)
      .send(data.Body);
  },
});

fastify.setErrorHandler(function (error, req, reply) {
  this.log.error(error);

  if (error.validation) {
    reply.status(422)
      .send(error.validation);
    return;
  }

  if (error.code == 'NoSuchKey') {
    reply.status(404)
      .send();
    return;
  }

  reply.status(500)
    .send();
});

fastify.listen({ host: "0.0.0.0", port: process.env.PORT });

process.on('SIGINT', () => fastify.close());
process.on('SIGTERM', () => fastify.close());
