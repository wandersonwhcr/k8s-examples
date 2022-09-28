const uuid = require('uuid');
const { Binary } = require('mongodb');

module.exports = {
  schema: {
    params: {
      artistId: { type: 'string', format: 'uuid' },
    },
    response: {
      200: {
        type: 'object',
        required: ['_id', 'name'],
        additionalProperties: false,
        properties: {
          _id: { type: 'string', format: 'uuid' },
          name: { type: 'string' }
        },
      },
      404: { type: 'null' },
    },
  },

  handler: async function (request, reply) {
    const _id = request.params.artistId;

    const result = await this.mongo.db.collection('artists')
      .findOne({
        _id: new Binary(uuid.parse(_id), Binary.SUBTYPE_UUID),
      });

    if (! result) {
      reply.status(404)
        .send();
      return;
    }

    result._id = uuid.stringify(result._id.buffer);

    reply.status(200)
      .header('last-modified', result.updatedAt.toUTCString())
      .send(result);
  },
};
