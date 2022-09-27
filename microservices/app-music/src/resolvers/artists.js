const axios = require('axios');

module.exports = async function (parent, args, context, info) {
  if (! parent) {
    return axios.get(process.env.APP_ARTISTS_URL + '/v1/artists')
      .then(result => result.data);
  }

  const promises = parent.artists.map((artist) => {
    return axios.get(process.env.APP_ARTISTS_URL + '/v1/artists/' + artist._id)
      .then(result => result.data);
  });

  return Promise.all(promises);
}
