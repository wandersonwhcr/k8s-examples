const uuid = require('uuid');
const { Binary } = require('mongodb');

module.exports = {
  schema: {
    params: {
      albumId: { type: 'string', format: 'uuid' },
    },
    response: {
      204: { type: 'null' },
      404: { type: 'null' },
    },
  },

  handler: async function (request, reply) {
    const _id = request.params.albumId;

    const result = await this.mongo.db.collection('albums')
      .deleteOne({
        _id: new Binary(uuid.parse(_id), Binary.SUBTYPE_UUID),
      });

    if (result.deletedCount === 0) {
      reply.status(404)
        .send();
      return;
    }

    reply.status(204)
      .send();
  },
};
