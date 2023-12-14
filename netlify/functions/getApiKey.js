// netlify-functions/getApiKey.js

exports.handler = async (event, context) => {
  const requestKey = event.queryStringParameters && event.queryStringParameters.key;

  let apiKey = process.env.apiKey1

  if (requestKey === 'apiKey2') {
    apiKey = process.env.apiKey2
  } else if (requestKey === 'apiKey3') {
    apiKey = process.env.apiKey3
  } else if (requestKey === 'apiKey4') {  
    apiKey = process.env.apiKey4 
  } else if (requestKey === 'apiKey5') {
    apiKey = process.env.apiKey5
  }

  return {
    statusCode: 200,
    body: JSON.stringify({ apiKey }),
  };
};
