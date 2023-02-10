const https = require("https");

exports.handler = (event, context, callback) => {
  const url = event.queryStringParameters.url;

  https.get(url, (response) => {
    let data = "";
    response.on("data", (chunk) => {
      data += chunk;
    });
    response.on("end", () => {
      callback(null, {
        statusCode: 200,
        body: data,
      });
    });
  });
};