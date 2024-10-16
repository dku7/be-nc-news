const articlesRouter = require("express").Router();
const {
  getArticleById,
  getArticles,
  patchArticleById,
} = require("../controllers/articles.controller");

const {
  getCommentsByArticleId,
  postNewComment,
} = require("../controllers/comments.controller");

// handle requests for /api/articles
articlesRouter.get("/", getArticles);

// handle requests for /api/articles/:article_id
articlesRouter
  .route("/:article_id")
  .get(getArticleById)
  .patch(patchArticleById);

// handle requests for /api/articles/:article_id/comments
articlesRouter
  .route("/:article_id/comments")
  .get(getCommentsByArticleId)
  .post(postNewComment);

module.exports = articlesRouter;
