const { selectTopics, insertNewTopic } = require("../models/topics.model");

function getTopics(request, response, next) {
  return selectTopics()
    .then((rows) => response.status(200).send({ topics: rows }))
    .catch(next);
}

function postNewTopic(request, response, next) {
  const minRequiredKeys = ["slug", "description"];
  const requestedNewTopic = request.body;
  const newTopicKeys = Object.keys(requestedNewTopic);

  // check the requested new topic has the required keys
  if (
    newTopicKeys.length < minRequiredKeys.length ||
    !minRequiredKeys.every((key) => newTopicKeys.includes(key))
  ) {
    return response.status(400).send({ status_code: 400, msg: "Bad request" });
  }

  return insertNewTopic(request.body)
    .then((newTopic) => response.status(201).send({ newTopic }))
    .catch(next);
}
module.exports = { getTopics, postNewTopic };
