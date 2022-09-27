const uuid = require('uuid');
const { Binary } = require('mongodb');

module.exports = {
  schema: {
    response: {
      200: {
        type: 'array',
        items: {
          type: 'object',
          required: ['_id', 'name'],
          additionalProperties: false,
          properties: {
            _id: { type: 'string', format: 'uuid' },
            name: { type: 'string' },
          },
        },
      },
    },
  },

  handler: async function (request, reply) {
    const result = await this.mongo.db.collection('artists')
      .find()
      .toArray();

    for (const artist of result) {
      artist._id = uuid.stringify(artist._id.buffer);
    }

    reply.status(200)
      .send(result);
  },
};
