const { selectArticleById } = require("../models/articles.model");
const {
  selectCommentsByArticleId,
  insertNewComment,
  selectCommentByCommentId,
  deleteCommentByCommentId,
  updateCommentByCommentId,
} = require("../models/comments.model");

function getCommentsByArticleId(request, response, next) {
  const { article_id } = request.params;
  const { limit, p } = request.query;

  // check limit and p are valid types and not negative
  if ((limit && (isNaN(limit) || limit < 0)) || (p && (isNaN(p) || p < 0)))
    return response.status(400).send({ status_code: 400, msg: "Bad request" });

  const promises = [
    selectCommentsByArticleId(article_id, limit, p),
    selectArticleById(article_id),
  ];

  return Promise.all(promises)
    .then((fulfilledPromises) =>
      response.status(200).send({ comments: fulfilledPromises[0] })
    )
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

function removeCommentByCommentId(request, response, next) {
  const { comment_id } = request.params;

  return deleteCommentByCommentId(comment_id)
    .then(() => response.status(204).send())
    .catch(next);
}

function patchCommentByCommentId(request, response, next) {
  const { comment_id } = request.params;

  // check that the request body includes the expected key
  if (!Object.keys(request.body).includes("inc_votes")) {
    return response.status(400).send({ status_code: 400, msg: "Bad request" });
  }

  const { inc_votes } = request.body;

  // check that the comment exists using Promise.all
  const promises = [
    updateCommentByCommentId(inc_votes, comment_id),
    selectCommentByCommentId(comment_id),
  ];

  return Promise.all(promises)
    .then((fulfilledPromises) =>
      response.status(200).send({ updatedComment: fulfilledPromises[0] })
    )
    .catch(next);
}

module.exports = {
  getCommentsByArticleId,
  postNewComment,
  removeCommentByCommentId,
  patchCommentByCommentId,
};
