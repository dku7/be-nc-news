const endpointsJSON = require("../endpoints.json");

function getEndpoints(request, response, next) {
  response.status(200).send({ endpoints: endpointsJSON });
}

module.exports = { getEndpoints };
