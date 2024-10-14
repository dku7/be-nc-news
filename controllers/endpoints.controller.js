const { selectEndpoints } = require("../models/endpoints.model");

function getEndpoints(request, response, next) {
  return selectEndpoints()
    .then((endpoints) => response.status(200).send({ endpoints }))
    .catch(next);
}

module.exports = { getEndpoints };
