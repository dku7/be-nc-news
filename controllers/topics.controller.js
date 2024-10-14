const { selectTopics } = require("../models/topics.model");

function getTopics(request, response, next) {
  return selectTopics()
    .then((rows) => response.status(200).send({ topics: rows }))
    .catch(next);
}

module.exports = { getTopics };
