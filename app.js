const express = require("express");
const { getTopics } = require("./controllers/topics.controller");
const { getEndpoints } = require("./controllers/endpoints.controller");
const {
  badPathsErrorHandler,
  defaultErrorHandler,
} = require("./error-handlers");

const app = express();

/**********************************************
 * GET methods
 **********************************************/
app.get("/api", getEndpoints);

app.get("/api/topics", getTopics);

/**********************************************
 * Error handlers
 **********************************************/
// invalid endpoint
app.all("*", badPathsErrorHandler);

// default, catch-all handler
app.use(defaultErrorHandler);

module.exports = app;
