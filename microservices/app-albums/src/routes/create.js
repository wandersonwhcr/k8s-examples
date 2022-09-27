const axios = require('axios');
const uuid = require('uuid');
const { Binary } = require('mongodb');

module.exports = {
  schema: {
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
    const _id = uuid.v4();

    for (const artist of request.body.artists) {
      await axios.get(process.env.APP_ARTISTS_URL + '/v1/artists/' + artist._id);
      artist._id = new Binary(uuid.parse(artist._id), Binary.SUBTYPE_UUID);
    }

    await this.mongo.db.collection('albums')
      .insertOne({
        _id: new Binary(uuid.parse(_id), Binary.SUBTYPE_UUID),
        ...request.body,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

    reply.status(201)
      .send({ _id });
  },
};
