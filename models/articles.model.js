const db = require("../db/connection");

function selectArticleById(article_id) {
  return db
    .query(`SELECT * FROM articles WHERE article_id = $1`, [article_id])
    .then((results) => {
      if (!results.rowCount)
        return Promise.reject({ status_code: 404, msg: "Not found" });

      return results.rows[0];
    });
}

function selectAllArticles() {
  return db
    .query(
      `
    SELECT
      articles.author,
      articles.title,
      articles.article_id,
      articles.topic,
      articles.created_at,
      articles.votes,
      articles.article_img_url,
      CAST(COUNT(comments.comment_id) AS INT) AS comment_count -- force to integer, otherwise returns as string in object
    FROM articles
    LEFT JOIN comments ON comments.article_id = articles.article_id
    GROUP BY
      articles.author,
      articles.title,
      articles.article_id,
      articles.topic,
      articles.created_at,
      articles.votes,
      articles.article_img_url
    ORDER BY 
      articles.created_at DESC
    `
    )
    .then((results) => results.rows);
}

function updateArticleById(votes, article_id) {
  return db
    .query(
      `
    UPDATE articles
    SET votes = GREATEST(votes + $1, 0) -- set to 0 if it goes negative
    WHERE article_id = $2
    RETURNING *`,
      [votes.inc_votes, article_id]
    )
    .then((results) => results.rows[0]);
}
module.exports = { selectArticleById, selectAllArticles, updateArticleById };
