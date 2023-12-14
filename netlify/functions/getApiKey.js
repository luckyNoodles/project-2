// netlify-functions/getApiKey.js

exports.handler = async (event, context) => {
  // Replace with your logic to retrieve the API key from a secure source
  const apiKey = process.env.apiKey

  return {
    statusCode: 200,
    body: JSON.stringify({ apiKey }),
  };
};
