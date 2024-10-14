const { selectCommentsByArticleId } = require("../models/comments.model");

function getCommentsByArticleId(request, response, next) {
  const { article_id } = request.params;

  return selectCommentsByArticleId(article_id)
    .then((comments) => response.status(200).send({ comments: comments }))
    .catch(next);
}

module.exports = { getCommentsByArticleId };
