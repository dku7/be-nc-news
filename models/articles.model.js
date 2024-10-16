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

function selectArticles(sort_by = "created_at", order = "desc", topic) {
  const allowedSortBy = [
    "author",
    "title",
    "article_id",
    "topic",
    "created_at",
    "votes",
    "article_img_url",
    "comment_count",
  ];

  const allowedOrders = ["asc", "desc"];

  if (!allowedSortBy.includes(sort_by) || !allowedOrders.includes(order)) {
    return Promise.reject({ status_code: 400, msg: "Bad request" });
  }

  let queryString = `
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
   `;

  const queryValues = [];

  if (topic) {
    queryString += " WHERE topic = $1 ";
    queryValues.push(topic);
  }

  queryString += `
    GROUP BY
      articles.author,
      articles.title,
      articles.article_id,
      articles.topic,
      articles.created_at,
      articles.votes,
      articles.article_img_url
    ORDER BY 
    ${sort_by} ${order}`;

  return db.query(queryString, queryValues).then((results) => results.rows);
}

function updateArticleById(inc_votes, article_id) {
  // check inc_votes in a number
  if (typeof inc_votes != "number")
    return Promise.reject({ status_code: 400, msg: "Bad request" });

  return db
    .query(
      `
    UPDATE articles
    SET votes = GREATEST(votes + $1, 0) -- set to 0 if it goes negative
    WHERE article_id = $2
    RETURNING *`,
      [inc_votes, article_id]
    )
    .then((results) => results.rows[0]);
}
module.exports = { selectArticleById, selectArticles, updateArticleById };
