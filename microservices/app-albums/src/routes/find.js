const uuid = require('uuid');
const { Binary } = require('mongodb');

module.exports = {
  schema: {
    params: {
      albumId: { type: 'string', format: 'uuid' },
    },
    response: {
      200: {
        type: 'object',
        required: ['_id', 'name', 'artists'],
        additionalProperties: false,
        properties: {
          _id: { type: 'string', format: 'uuid' },
          name: { type: 'string' },
          artists: {
            type: 'array',
            minItems: 1,
            items: {
              type: 'object',
              required: ['_id'],
              additionalProperties: false,
              properties: {
                _id: { type: 'string', format: 'uuid' },
              },
            },
          },
        },
      },
      404: { type: 'null' },
    },
  },

  handler: async function (request, reply) {
    const _id = request.params.albumId;

    const result = await this.mongo.db.collection('albums')
      .findOne({
        _id: new Binary(uuid.parse(_id), Binary.SUBTYPE_UUID),
      });

    if (! result) {
      reply.status(404)
        .send();
      return;
    }

    result._id = uuid.stringify(result._id.buffer);

    for (const artist of result.artists) {
      artist._id = uuid.stringify(artist._id.buffer);
    }

    reply.status(200)
      .header('last-modified', result.updatedAt.toUTCString())
      .send(result);
  },
};
