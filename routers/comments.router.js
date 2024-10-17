const commentsRouter = require("express").Router();
const {
  removeCommentByCommentId,
  patchCommentByCommentId,
} = require("../controllers/comments.controller");

// handle requests for /api/comments/:comment_id
commentsRouter
  .route("/:comment_id")
  .delete(removeCommentByCommentId)
  .patch(patchCommentByCommentId);

module.exports = commentsRouter;
