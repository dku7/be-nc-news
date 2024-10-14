const request = require("supertest");
const app = require("../app");

const db = require("../db/connection");

const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data");
const endpointsJSON = require("../endpoints.json");

beforeAll(() => seed(testData));
afterAll(() => db.end());

describe("All bad paths", () => {
  test("GET: 404 - respond with message 'Path not found' when accessing an invalid endpoint", () => {
    return request(app)
      .get("/api/invalid-endpoint-name")
      .expect(404)
      .then(({ body: { msg } }) => expect(msg).toBe("Path not found"));
  });
});

describe("/api", () => {
  test("GET: 200 - respond with an array of all currently available endpoints detailing: the method/name of endpoint; description; accepted queries; example response", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body: { endpoints } }) => {
        expect(endpoints).toEqual(endpointsJSON);
      });
  });
});

describe("/api/topics", () => {
  test("GET: 200 - respond with an array of topic objects wih the following properties: slug, description", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body: { topics } }) => {
        expect(topics).toHaveLength(3);

        topics.forEach((topic) => {
          expect(topic).toHaveProperty("slug");
          expect(topic).toHaveProperty("description");
        });
      });
  });
});

describe("/api/articles/:article_id", () => {
  test("GET: 200 - respond with an article object for the specified article_id", () => {
    return request(app)
      .get("/api/articles/5")
      .expect(200)
      .then(({ body: { article } }) => {
        expect(article).toMatchObject({
          article_id: 5,
          title: "UNCOVERED: catspiracy to bring down democracy",
          topic: "cats",
          author: "rogersop",
          body: "Bastet walks amongst us, and the cats are taking arms!",
          created_at: "2020-08-03T13:14:00.000Z",
          votes: 0,
          article_img_url:
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
        });
      });
  });

  test("GET: 404 - respond with message 'Not found' when the specified article_id is not found", () => {
    return request(app)
      .get("/api/articles/9999")
      .expect(404)
      .then(({ body: { msg } }) => expect(msg).toBe("Not found"));
  });

  test('GET: 400 - respond with message "Bad request" when the specified article_id is not the correct data type', () => {
    return request(app)
      .get("/api/articles/not-a-number")
      .expect(400)
      .then(({ body: { msg } }) => expect(msg).toBe("Bad request"));
  });
});

describe("/api/articles", () => {
  test("GET: 200 - respond with an array of all article objects sorted by date in descending order", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles).toHaveLength(13);

        articles.forEach((article) => {
          expect(article).toMatchObject({
            author: expect.any(String),
            title: expect.any(String),
            article_id: expect.any(Number),
            topic: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            article_img_url: expect.any(String),
            comment_count: expect.any(Number),
          });
        });

        expect(articles).toBeSortedBy("created_at", { descending: true });
      });
  });
});

describe("/api/articles/:article_id/comments", () => {
  test("GET: 200 - respond with an array of comments ordered by the most recent comment first when given a valid article_id that has comments", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body: { comments } }) => {
        expect(comments).toHaveLength(11);
        comments.forEach((comment) =>
          expect(comment).toMatchObject({
            comment_id: expect.any(Number),
            votes: expect.any(Number),
            created_at: expect.any(String),
            author: expect.any(String),
            body: expect.any(String),
            article_id: 1,
          })
        );

        expect(comments).toBeSortedBy("created_at", { descending: true });
      });
  });

  test("GET: 200 - respond with an empty array when given a valid article_id that doesn't have any comments", () => {
    return request(app)
      .get("/api/articles/4/comments")
      .expect(200)
      .then(({ body: { comments } }) => {
        expect(comments).toHaveLength(0);
      });
  });

  test("GET: 404 - respond with message 'Not found' when the specified article_id is not found", () => {
    return request(app)
      .get("/api/articles/9999/comments")
      .expect(404)
      .then(({ body: { msg } }) => expect(msg).toBe("Not found"));
  });

  test('GET: 400 - respond with message "Bad request" when the specified article_id is not the correct data type', () => {
    return request(app)
      .get("/api/articles/not-a-number/comments")
      .expect(400)
      .then(({ body: { msg } }) => expect(msg).toBe("Bad request"));
  });
});
