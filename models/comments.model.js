const db = require("../db/connection");
const format = require("pg-format");

function selectCommentsByArticleId(article_id, limit = 10, p) {
  const queryValues = [article_id, limit];
  let queryString = `
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
    LIMIT $2`;

  if (p) {
    queryValues.push(limit * (p - 1));
    queryString += ` OFFSET $${queryValues.length}`;
  }

  return db.query(queryString, queryValues).then((results) => results.rows);
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

function updateCommentByCommentId(inc_votes, comment_id) {
  // check inc_votes is a number
  if (typeof inc_votes != "number")
    return Promise.reject({ status_code: 400, msg: "Bad request" });

  return db
    .query(
      `
    UPDATE comments
    SET votes = votes + $1
    WHERE comment_id = $2
    RETURNING *`,
      [inc_votes, comment_id]
    )
    .then((results) => results.rows[0]);
}

module.exports = {
  selectCommentsByArticleId,
  insertNewComment,
  selectCommentByCommentId,
  deleteCommentByCommentId,
  updateCommentByCommentId,
};
