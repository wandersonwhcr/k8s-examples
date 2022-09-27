const axios = require('axios');

module.exports = async function (args) {
  return axios.get(process.env.APP_ARTISTS_URL + '/v1/artists/' + args.id)
    .then(response => response.data);
};
