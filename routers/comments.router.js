const commentsRouter = require("express").Router();
const {
  removeCommentByCommentId,
} = require("../controllers/comments.controller");

// handle requests for /api/comments/:comment_id
commentsRouter.delete("/:comment_id", removeCommentByCommentId);

module.exports = commentsRouter;
