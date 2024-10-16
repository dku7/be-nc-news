const topicsRouter = require("express").Router();
const { getTopics } = require("../controllers/topics.controller");

// handle requests for /api/topics
topicsRouter.get("/", getTopics);

module.exports = topicsRouter;
