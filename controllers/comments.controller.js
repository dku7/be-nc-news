const { selectArticleById } = require("../models/articles.model");

const { selectCommentsByArticleId } = require("../models/comments.model");

function getCommentsByArticleId(request, response, next) {
  const { article_id } = request.params;

  // test whether the article exists first
  return selectArticleById(article_id)
    .then((article) => selectCommentsByArticleId(article.article_id))
    .then((comments) => response.status(200).send({ comments: comments }))
    .catch(next);
}

module.exports = { getCommentsByArticleId };
