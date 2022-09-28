const axios = require('axios');
const uuid = require('uuid');
const { Binary } = require('mongodb');

module.exports = {
  schema: {
    params: {
      albumId: { type: 'string', format: 'uuid' },
    },
    body: {
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
    response: {
      204: { type: 'null' },
      404: { type: 'null' },
    },
  },

  handler: async function (request, reply) {
    const _id = request.params.albumId;

    for (const artist of request.body.artists) {
      await axios.get(process.env.APP_ARTISTS_URL + '/v1/artists/' + artist._id);
      artist._id = new Binary(uuid.parse(artist._id), Binary.SUBTYPE_UUID);
    }

    const result = await this.mongo.db.collection('albums')
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
