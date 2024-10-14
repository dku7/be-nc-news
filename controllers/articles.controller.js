const { selectArticleById } = require("../models/articles.model");

function getArticleById(request, response, next) {
  const { article_id } = request.params;

  return selectArticleById(article_id)
    .then((rows) => response.status(200).send({ article: rows[0] }))
    .catch(next);
}

module.exports = { getArticleById };
