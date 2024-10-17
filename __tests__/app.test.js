const request = require("supertest");
const app = require("../app");

const db = require("../db/connection");

const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data");
const endpointsJSON = require("../endpoints.json");

beforeEach(() => seed(testData));
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
  describe("GET", () => {
    test("GET: 200 - respond with an article object for the specified article_id (when article has comments)", () => {
      const article_id = 5;

      return request(app)
        .get(`/api/articles/${article_id}`)
        .expect(200)
        .then(({ body: { article } }) => {
          expect(article).toMatchObject({
            article_id: article_id,
            title: "UNCOVERED: catspiracy to bring down democracy",
            topic: "cats",
            author: "rogersop",
            body: "Bastet walks amongst us, and the cats are taking arms!",
            created_at: "2020-08-03T13:14:00.000Z",
            votes: 0,
            article_img_url:
              "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
            comment_count: 2,
          });
        });
    });

    test("GET: 200 - respond with an article object for the specified article_id (when article has no comments)", () => {
      const article_id = 2;

      return request(app)
        .get(`/api/articles/${article_id}`)
        .expect(200)
        .then(({ body: { article } }) => {
          expect(article).toMatchObject({
            article_id: article_id,
            title: "Sony Vaio; or, The Laptop",
            topic: "mitch",
            author: "icellusedkars",
            body: "Call me Mitchell. Some years ago—never mind how long precisely—having little or no money in my purse, and nothing particular to interest me on shore, I thought I would buy a laptop about a little and see the codey part of the world. It is a way I have of driving off the spleen and regulating the circulation. Whenever I find myself growing grim about the mouth; whenever it is a damp, drizzly November in my soul; whenever I find myself involuntarily pausing before coffin warehouses, and bringing up the rear of every funeral I meet; and especially whenever my hypos get such an upper hand of me, that it requires a strong moral principle to prevent me from deliberately stepping into the street, and methodically knocking people’s hats off—then, I account it high time to get to coding as soon as I can. This is my substitute for pistol and ball. With a philosophical flourish Cato throws himself upon his sword; I quietly take to the laptop. There is nothing surprising in this. If they but knew it, almost all men in their degree, some time or other, cherish very nearly the same feelings towards the the Vaio with me.",
            created_at: "2020-10-16T05:03:00.000Z",
            votes: 0,
            article_img_url:
              "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
            comment_count: 0,
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

  describe("PATCH", () => {
    test("PATCH: 200 - update the specified article, increasing the votes and respond with an object representing the updated article", () => {
      const input = { inc_votes: 1 };

      return request(app)
        .patch("/api/articles/3")
        .send(input)
        .expect(200)
        .then(({ body: { updatedArticle } }) => {
          expect(updatedArticle.article_id).toBe(3);
          expect(updatedArticle.votes).toBe(1);
        });
    });

    test("PATCH: 200 - update the specified article, decreasing the votes and respond with an object representing the updated article", () => {
      const input = { inc_votes: -1 };

      return request(app)
        .patch("/api/articles/1")
        .send(input)
        .expect(200)
        .then(({ body: { updatedArticle } }) => {
          expect(updatedArticle.article_id).toBe(1);
          expect(updatedArticle.votes).toBe(99);
        });
    });

    test("PATCH: 200 - if the number of inc_votes is greater than the current votes the returned votes should be 0, not negative", () => {
      const input = { inc_votes: -100 };

      return request(app)
        .patch("/api/articles/4")
        .send(input)
        .expect(200)
        .then(({ body: { updatedArticle } }) => {
          expect(updatedArticle.article_id).toBe(4);
          expect(updatedArticle.votes).toBe(0);
        });
    });

    test('PATCH: 400 - respond with message "Bad request" when the specified article_id is not the correct data type', () => {
      const input = { inc_votes: 1 };

      return request(app)
        .patch("/api/articles/not-a-number")
        .send(input)
        .expect(400)
        .then(({ body: { msg } }) => expect(msg).toBe("Bad request"));
    });

    test('PATCH: 400 - respond with message "Bad Request" when the wrong data type is provided for the patch', () => {
      return request(app)
        .patch("/api/articles/1")
        .expect(400)
        .send({ inc_votes: "this is a string not a number!" })
        .then((result) => {
          expect(result.body.msg).toBe("Bad request");
        });
    });

    test("PATCH: 404 - respond with message 'Not found' when the specified article_id is not found", () => {
      const input = { inc_votes: 1 };

      return request(app)
        .patch("/api/articles/9999")
        .send(input)
        .expect(404)
        .then(({ body: { msg } }) => expect(msg).toBe("Not found"));
    });
  });
});

describe("/api/articles", () => {
  describe("GET", () => {
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

  describe("Sorting queries", () => {
    test("GET: 200 - respond with an array of all article objects sorted by the specified column and in ascending order", () => {
      return request(app)
        .get("/api/articles?sort_by=author&order=asc")
        .expect(200)
        .then(({ body: { articles } }) => {
          expect(articles).toBeSortedBy("author");
        });
    });

    test("GET: 200 - respond with an array of all article objects sorted by the specified column and in descending order", () => {
      return request(app)
        .get("/api/articles?sort_by=topic&order=desc")
        .expect(200)
        .then(({ body: { articles } }) => {
          expect(articles).toBeSortedBy("topic", { descending: true });
        });
    });

    test('GET: 400 - respond with message "Bad request" when attempting to sort by a disallowed column', () => {
      return request(app)
        .get("/api/articles?sort_by=disallowed-column-name&order=desc")
        .expect(400)
        .then(({ body: { msg } }) => expect(msg).toBe("Bad request"));
    });

    test('GET: 400 - respond with message "Bad request" when attempting to order by an invalid value', () => {
      return request(app)
        .get("/api/articles?sort_by=author&order=invalid")
        .expect(400)
        .then(({ body: { msg } }) => expect(msg).toBe("Bad request"));
    });
  });

  describe("Topic query", () => {
    test("GET: 200 - respond with an array of all article objects when filtered by a existing topic", () => {
      const topic = "mitch";

      return request(app)
        .get(`/api/articles?topic=${topic}`)
        .expect(200)
        .then(({ body: { articles } }) => {
          expect(articles).toHaveLength(12);
          articles.forEach((article) =>
            expect(article).toMatchObject({
              author: expect.any(String),
              title: expect.any(String),
              article_id: expect.any(Number),
              topic: topic,
              created_at: expect.any(String),
              votes: expect.any(Number),
              article_img_url: expect.any(String),
              comment_count: expect.any(Number),
            })
          );
        });
    });

    test("GET: 200 - respond with an empty array when filtered by a non-existent topic", () => {
      const topic = "non-existent-topic";

      return request(app)
        .get(`/api/articles?topic=${topic}`)
        .expect(200)
        .then(({ body: { articles } }) => {
          expect(Array.isArray(articles)).toBe(true);
          expect(articles).toHaveLength(0);
        });
    });
  });
});

describe("/api/articles/:article_id/comments", () => {
  describe("GET", () => {
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

  describe("POST", () => {
    test("POST: 201 - add a new comment for the specified article_id and respond with an object representing the posted comment", () => {
      const input = {
        body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc sit amet sapien vitae nibh convallis mollis. Donec feugiat elit eu enim gravida imperdiet.",
        author: "lurker",
      };

      return request(app)
        .post("/api/articles/1/comments")
        .send(input)
        .expect(201)
        .then(({ body: { newComment } }) => {
          expect(newComment).toMatchObject({
            body: input.body,
            article_id: 1,
            author: input.author,
            comment_id: expect.any(Number),
            created_at: expect.any(String),
            votes: 0,
          });
        });
    });

    test('POST: 400 - respond with message "Bad request" when the given new comment does not specify body and/or author', () => {
      const missingEverything = {};
      const missingBody = { author: "lurker" };
      const missingAuthor = {
        body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc sit amet sapien vitae nibh convallis mollis. Donec feugiat elit eu enim gravida imperdiet.",
      };

      const testCases = [missingEverything, missingBody, missingAuthor];
      const promises = testCases.map((testCase) => {
        return request(app).post("/api/articles/1/comments").send(testCase);
      });

      return Promise.all(promises).then((responses) => {
        responses.forEach((response) => {
          expect(response.statusCode).toBe(400);
          expect(response.body.msg).toBe("Bad request");
        });
      });
    });

    test('POST: 404 - respond with message "Not found" when the specified author does not exist in the database', () => {
      const input = {
        body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc sit amet sapien vitae nibh convallis mollis. Donec feugiat elit eu enim gravida imperdiet.",
        author: "idonotexist",
      };

      return request(app)
        .post("/api/articles/1/comments")
        .send(input)
        .expect(404)
        .then(({ body: { msg } }) => expect(msg).toBe("Not found"));
    });

    test('POST: 404 - respond with message "Not found" when the specified article_id does not exist in the database', () => {
      const input = {
        body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc sit amet sapien vitae nibh convallis mollis. Donec feugiat elit eu enim gravida imperdiet.",
        author: "lurker",
      };

      return request(app)
        .post("/api/articles/9999/comments")
        .send(input)
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Not found");
        });
    });
  });
});

describe("/api/comments/:comment_id", () => {
  describe("DELETE", () => {
    test("DELETE: 204 - respond with status code of 204 with no content on successfully deleting a comment", () => {
      return request(app).delete("/api/comments/5").expect(204);
    });

    test('DELETE: 400 - respond with message "Bad request" when the specified comment_id is not the correct data type', () => {
      return request(app)
        .delete("/api/comments/not-a-number")
        .expect(400)
        .then(({ body: { msg } }) => expect(msg).toBe("Bad request"));
    });
  });
});

describe("/api/users", () => {
  describe("GET", () => {
    test("GET: 200 - respond with an array of user objects with the following properties: username, name, avatar_url", () => {
      return request(app)
        .get("/api/users")
        .expect(200)
        .then(({ body: { users } }) => {
          expect(users).toHaveLength(4);

          users.forEach((user) => {
            expect(user).toMatchObject({
              username: expect.any(String),
              name: expect.any(String),
              avatar_url: expect.any(String),
            });
          });
        });
    });
  });
});

describe("/api/users/:username", () => {
  const username = "icellusedkars";

  test("GET: 200 - respond with a user object for the specified username", () => {
    return request(app)
      .get(`/api/users/${username}`)
      .expect(200)
      .then(({ body: { user } }) =>
        expect(user).toMatchObject({
          username: username,
          name: "sam",
          avatar_url:
            "https://avatars2.githubusercontent.com/u/24604688?s=460&v=4",
        })
      );
  });

  test('GET: 404 - respond with message "Not found" when the specified username is not found', () => {
    return request(app)
      .get("/api/users/user-does-not-exist")
      .expect(404)
      .then(({ body: { msg } }) => expect(msg).toBe("Not found"));
  });
});
