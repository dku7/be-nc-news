const endpointsJSON = require("../endpoints.json");

function selectEndpoints() {
  return new Promise((resolve, reject) => resolve(endpointsJSON));
}

module.exports = { selectEndpoints };
