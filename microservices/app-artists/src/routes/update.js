const uuid = require('uuid');
const { Binary } = require('mongodb');

module.exports = {
  schema: {
    params: {
      artistId: { type: 'string', format: 'uuid' },
    },
    body: {
      type: 'object',
      required: ['name'],
      additionalProperties: false,
      properties: {
        name: { type: 'string' },
      },
    },
    response: {
      204: { type: 'null' },
      404: { type: 'null' },
    },
  },

  handler: async function (request, reply) {
    const _id = request.params.artistId;

    const result = await this.mongo.db.collection('artists')
      .updateOne({
        _id: new Binary(uuid.parse(_id), Binary.SUBTYPE_UUID),
      }, { $set: { ...request.body, updatedAt: new Date() } });

    if (result.matchedCount === 0) {
      reply.status(404)
        .send();
      return;
    }

    reply.status(204)
      .send();
  },
};
