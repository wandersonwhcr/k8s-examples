const axios = require('axios');

module.exports = async function (parent, args, context, info) {
  if (! parent) {
    return axios.get(process.env.APP_ALBUMS_URL + '/v1/albums/' + args._id)
      .then(response => response.data);
  }

  return axios.get(process.env.APP_ALBUMS_URL + '/v1/albums/' + parent._id)
    .then(response => response.data);
};
