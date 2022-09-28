const axios = require('axios');

module.exports = async function (parent, args, context, info) {
  if (! parent) {
    return axios.get(process.env.APP_ARTISTS_URL + '/v1/artists/' + args._id)
      .then(response => response.data);
  }

  return axios.get(process.env.APP_ARTISTS_URL + '/v1/artists/' + parent._id)
    .then(response => response.data);
};
