const axios = require('axios');

module.exports = async function (parent, args, context, info) {
  if (! parent) {
    return axios.get(process.env.APP_ALBUMS_URL + '/v1/albums')
      .then(response => response.data);
  }

  return axios
    .get(process.env.APP_ALBUMS_URL + '/v1/albums', { params: { 'artist._id': parent._id } })
    .then(response => response.data);
};
