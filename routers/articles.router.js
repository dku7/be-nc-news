const articlesRouter = require("express").Router();
const {
  getArticleById,
  getArticles,
  patchArticleById,
  postNewArticle,
  removeArticleByArticleId,
} = require("../controllers/articles.controller");

const {
  getCommentsByArticleId,
  postNewComment,
} = require("../controllers/comments.controller");

// handle requests for /api/articles
articlesRouter.route("/").get(getArticles).post(postNewArticle);

// handle requests for /api/articles/:article_id
articlesRouter
  .route("/:article_id")
  .get(getArticleById)
  .delete(removeArticleByArticleId)
  .patch(patchArticleById);

// handle requests for /api/articles/:article_id/comments
articlesRouter
  .route("/:article_id/comments")
  .get(getCommentsByArticleId)
  .post(postNewComment);

module.exports = articlesRouter;
