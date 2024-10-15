const { selectArticleById } = require("../models/articles.model");
const {
  selectCommentsByArticleId,
  insertNewComment,
} = require("../models/comments.model");

function getCommentsByArticleId(request, response, next) {
  const { article_id } = request.params;

  // test whether the article exists first
  return selectArticleById(article_id)
    .then((article) => selectCommentsByArticleId(article.article_id))
    .then((comments) => response.status(200).send({ comments: comments }))
    .catch(next);
}

function postNewComment(request, response, next) {
  const { article_id } = request.params;

  const promises = [
    insertNewComment(request.body, article_id),
    selectArticleById(article_id),
  ];

  return Promise.all(promises)
    .then((results) => {
      response.status(201).send({ newComment: results[0] });
    })
    .catch(next);
}
module.exports = { getCommentsByArticleId, postNewComment };
