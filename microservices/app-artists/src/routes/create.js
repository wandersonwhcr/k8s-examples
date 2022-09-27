module.exports = {
  schema: {
    body: {
      type: 'object',
      required: ['name'],
      additionalProperties: false,
      properties: {
        name: { type: 'string' },
      },
    },
    response: {
      201: {
        type: 'object',
        required: ['_id'],
        additionalProperties: false,
        properties: {
          _id: { type: 'string', format: 'uuid' },
        },
      },
    },
  },

  handler: async function (request, reply) {
    const _id = '5d126aff-a3e7-48ab-9b1e-a5d883a82531';

    reply.status(201)
      .send({ _id });
  },
};
