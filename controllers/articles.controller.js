const {
  selectArticleById,
  selectArticles,
  updateArticleById,
  insertNewArticle,
} = require("../models/articles.model");

function getArticleById(request, response, next) {
  const { article_id } = request.params;

  return selectArticleById(article_id)
    .then((article) => response.status(200).send({ article }))
    .catch(next);
}

function getArticles(request, response, next) {
  const { sort_by, order, topic, limit, p } = request.query;

  // check limit and p are valid types and not negative
  if ((limit && (isNaN(limit) || limit < 0)) || (p && (isNaN(p) || p < 0)))
    return response.status(400).send({ status_code: 400, msg: "Bad request" });

  return selectArticles(sort_by, order, topic, limit, p)
    .then((articles) =>
      response.status(200).send({
        total_count: articles.length,
        articles: articles,
      })
    )
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

function postNewArticle(request, response, next) {
  const minRequiredKeys = ["author", "title", "body", "topic"];
  const requestedNewArticle = request.body;
  const newArticleKeys = Object.keys(requestedNewArticle);

  // check the requested new article has the required keys
  if (
    newArticleKeys.length < minRequiredKeys.length ||
    !minRequiredKeys.every((key) => newArticleKeys.includes(key))
  ) {
    return response.status(400).send({ status_code: 400, msg: "Bad request" });
  }

  return insertNewArticle(requestedNewArticle)
    .then((article_id) => selectArticleById(article_id))
    .then((newArticle) => response.status(201).send({ newArticle }))
    .catch(next);
}

module.exports = {
  getArticleById,
  getArticles,
  patchArticleById,
  postNewArticle,
};
