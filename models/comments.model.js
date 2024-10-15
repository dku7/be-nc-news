const db = require("../db/connection");
const format = require("pg-format");

function selectCommentsByArticleId(article_id) {
  return (
    db
      .query(
        `
    SELECT
      comment_id,
      votes,
      created_at,
      author,
      body,
      article_id
    FROM comments
    WHERE article_id = $1
    ORDER BY created_at DESC
    `,
        [article_id]
      )
      // N.B. no need to test for empty rows as it is valid for no comments
      // to be attached to an article. We can assume that article_id has been
      // validated by controller before we query the database
      .then((results) => results.rows)
  );
}

function insertNewComment(newComment, article_id) {
  const insertValues = [[newComment.body, article_id, newComment.author]];

  return db
    .query(
      format(
        `
      INSERT INTO comments(body, article_id, author) 
      VALUES %L 
      RETURNING *`,
        insertValues
      )
    )
    .then((results) => {
      return results.rows[0];
    });
}

function selectCommentByCommentId(comment_id) {
  return db
    .query("SELECT * FROM comments WHERE comment_id = $1", [comment_id])
    .then((results) => {
      if (!results.rowCount)
        return Promise.reject({ status_code: 404, msg: "Not found" });

      return results.rows[0];
    });
}
function deleteCommentByCommentId(comment_id) {
  return db.query("DELETE FROM comments WHERE comment_id = $1", [comment_id]);
}

module.exports = {
  selectCommentsByArticleId,
  insertNewComment,
  selectCommentByCommentId,
  deleteCommentByCommentId,
};
