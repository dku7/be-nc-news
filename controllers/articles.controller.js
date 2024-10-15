const {
  selectArticleById,
  selectAllArticles,
  updateArticleById,
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

function patchArticleById(request, response, next) {
  const { article_id } = request.params;

  // check that the request body includes the expected key
  if (!Object.keys(request.body).includes("inc_votes")) {
    return response.status(400).send({ status_code: 400, msg: "Bad request" });
  }

  // check that the article exists using Promise.all
  const promises = [
    updateArticleById(request.body, article_id),
    selectArticleById(article_id),
  ];

  return Promise.all(promises)
    .then((results) =>
      response.status(200).send({ updatedArticle: results[0] })
    )
    .catch(next);
}
module.exports = { getArticleById, getAllArticles, patchArticleById };
