const uuid = require('uuid');
const { Binary } = require('mongodb');

module.exports = {
  schema: {
    query: {
      'artist._id': { type: 'string', format: 'uuid' },
    },
    response: {
      200: {
        type: 'array',
        items: {
          type: 'object',
          required: ['name', 'artists'],
          additionalProperties: false,
          properties: {
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
      },
    },
  },

  handler: async function (request, reply) {
    const filter = {};

    if (request.query['artist._id']) {
      filter.artists = {
        _id: new Binary(uuid.parse(request.query['artist._id']), Binary.SUBTYPE_UUID),
      };
    }

    const result = await this.mongo.db.collection('albums')
      .find(filter)
      .toArray();

    for (const album of result) {
      album._id = uuid.stringify(album._id.buffer);
      for (const artist of album.artists) {
        artist._id = uuid.stringify(artist._id.buffer);
      }
    }

    reply.status(200)
      .send(result);
  },
};
