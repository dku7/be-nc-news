const {
  selectArticleById,
  selectAllArticles,
} = require("../models/articles.model");

function getArticleById(request, response, next) {
  const { article_id } = request.params;

  return selectArticleById(article_id)
    .then((rows) => response.status(200).send({ article: rows }))
    .catch(next);
}

function getAllArticles(request, response, next) {
  return selectAllArticles()
    .then((rows) => response.status(200).send({ articles: rows }))
    .catch(next);
}
module.exports = { getArticleById, getAllArticles };
