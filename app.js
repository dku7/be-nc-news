const express = require("express");

const {
  getArticleById,
  getAllArticles,
  patchArticleById,
} = require("./controllers/articles.controller");
const {
  getCommentsByArticleId,
  postNewComment,
  removeCommentByCommentId,
} = require("./controllers/comments.controller");
const { getEndpoints } = require("./controllers/endpoints.controller");
const { getTopics } = require("./controllers/topics.controller");
const { getUsers } = require("./controllers/users.controller");

const {
  badPathsErrorHandler,
  customErrorHandler,
  psqlErrorHandler,
  defaultErrorHandler,
} = require("./error-handlers");

const app = express();

app.use(express.json());

/**********************************************
 * GET methods
 **********************************************/
app.get("/api", getEndpoints);

app.get("/api/topics", getTopics);

app.get("/api/articles/:article_id", getArticleById);

app.get("/api/articles", getAllArticles);

app.get("/api/articles/:article_id/comments", getCommentsByArticleId);

app.get("/api/users", getUsers);

/**********************************************
 * POST methods
 **********************************************/
app.post("/api/articles/:article_id/comments", postNewComment);

/**********************************************
 * PATCH methods
 **********************************************/
app.patch("/api/articles/:article_id", patchArticleById);

/**********************************************
 * DELETE methods
 **********************************************/
app.delete("/api/comments/:comment_id", removeCommentByCommentId);

/**********************************************
 * Error handlers
 **********************************************/
// invalid endpoint
app.all("*", badPathsErrorHandler);

// handle custom, manually thrown errors
app.use(customErrorHandler);

// handle errors thrown by PSQL queries
app.use(psqlErrorHandler);

// default, catch-all handler
app.use(defaultErrorHandler);

module.exports = app;
