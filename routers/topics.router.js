const topicsRouter = require("express").Router();
const { getTopics, postNewTopic } = require("../controllers/topics.controller");

// handle requests for /api/topics
topicsRouter.route("/").get(getTopics).post(postNewTopic);

module.exports = topicsRouter;
