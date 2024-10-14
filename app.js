const express = require("express");

const { getArticleById } = require("./controllers/articles.controller");
const { getEndpoints } = require("./controllers/endpoints.controller");
const { getTopics } = require("./controllers/topics.controller");

const {
  badPathsErrorHandler,
  customErrorHandler,
  psqlErrorHandler,
  defaultErrorHandler,
} = require("./error-handlers");

const app = express();

/**********************************************
 * GET methods
 **********************************************/
app.get("/api", getEndpoints);

app.get("/api/topics", getTopics);

app.get("/api/articles/:article_id", getArticleById);

/**********************************************
 * Error handlers
 **********************************************/
// invalid endpoint
app.all("*", badPathsErrorHandler);

// handle custom error e.g. manually thrown 404 ('Not found')
app.use(customErrorHandler);

// handle errors thrown by PSQL queries e.g. 400 ('Bad request')
app.use(psqlErrorHandler);

// default, catch-all handler
app.use(defaultErrorHandler);

module.exports = app;
