const axios = require("axios");

exports.handler = async (event, context) => {
  const url = event.queryStringParameters.url;
  const response = await axios.get(url);
  return {
    statusCode: 200,
    body: JSON.stringify(response.data)
  };
};