const {
  selectArticleById,
  selectArticles,
  updateArticleById,
} = require("../models/articles.model");

function getArticleById(request, response, next) {
  const { article_id } = request.params;

  return selectArticleById(article_id)
    .then((article) => response.status(200).send({ article }))
    .catch(next);
}

function getArticles(request, response, next) {
  const { sort_by, order } = request.query;

  return selectArticles(sort_by, order)
    .then((articles) => response.status(200).send({ articles }))
    .catch(next);
}

function patchArticleById(request, response, next) {
  const { article_id } = request.params;

  // check that the request body includes the expected key
  if (!Object.keys(request.body).includes("inc_votes")) {
    return response.status(400).send({ status_code: 400, msg: "Bad request" });
  }

  const { inc_votes } = request.body;

  // check that the article exists using Promise.all
  const promises = [
    updateArticleById(inc_votes, article_id),
    selectArticleById(article_id),
  ];

  return Promise.all(promises)
    .then((fulfilledPromises) =>
      response.status(200).send({ updatedArticle: fulfilledPromises[0] })
    )
    .catch(next);
}
module.exports = { getArticleById, getArticles, patchArticleById };
