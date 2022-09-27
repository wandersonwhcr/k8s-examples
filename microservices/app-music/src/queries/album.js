const axios = require('axios');

module.exports = async function (args) {
  const response = await axios.get(process.env.APP_ALBUMS_URL + '/v1/albums/' + args.id);
  return response.data;
};
