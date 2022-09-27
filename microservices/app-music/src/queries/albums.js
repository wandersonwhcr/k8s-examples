const axios = require('axios');

module.exports = async function () {
  const response = await axios.get(process.env.APP_ALBUMS_URL + '/v1/albums');
  return response.data;
};
