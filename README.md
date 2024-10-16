# Northcoders News API

## Table of Contents

- [About](#about)
- [Installation](#installation)
- [Environment Configuration](#environment-configuration)
- [Testing](#testing)
- [Minimum Versions](#minimum-versions)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)

This service is currently hosted at https://nc-news-lpqp.onrender.com

## About

This API was created as part of my enrolment on the [Northcoders](https://northcoders.com/) JavaScript Software Development Bootcamp (2024). It is designed to replicate a real-world back-end service for a social network similar to Reddit. This API provides full CRUD (Create, Read, Update, Delete) operations on articles, comments, users, and topics. It supports core features expected in a real-world, RESTful platform, such as parametric endpoints and query parameters.

It has been built using Test-Driven Development (TDD) with JavaScript (ES6+) and adheres to MVC best practices to ensure a clear separation of concerns within modules. The back-end is powered by Node.js, Express.js, and PostgreSQL.

## Installation

- **Clone the repository**: `git clone https://github.com/dku7/be-nc-news`
- **Install dependencies**: Navigate to the project directory and install the required Node.js dependencies using: `npm install`
- **Set up the local databases**: Create the test and development databases by running: `npm run setup-dbs`
- **Create environment variable files**: Create `.env` files for your test and development environments. See the [Environment Configuration](#environment-configuration) section for details on the required variables.
- **Seed the local database**: Populate the local database with the provided seed data using: `npm run seed`

## Environment Configuration

To use this API, you will need to create a `.env` file for each environment. This setup utilises the `dotenv` npm package to dynamically configure the PostgreSQL database connection.

- **For Testing**: create a file called `.env.test` and add the following line: `PGDATABASE=nc_news_test`
- **For Development**: create a file called `.env.development` and add the following line: `PGDATABASE=nc_news`

**Important**: It is crucial that these files are configured exactly as shown. Adding extra characters, such as a semicolon (`;`), will cause the API to fail.

## Testing

The project includes test scripts that utilise **Supertest** to create an HTTP listener and make requests to the API, while **Jest** is used to assert the results of these tests. You can run the tests by executing the following command: `npm test`

**Note**: If you want to test the API without running tests for other supporting modules, you can use: `npm test app`

Before each test, the database is reseeded, ensuring that any changes made during testing do not persist beyond the test execution.

If you would like to try the API with persisted data, you can run it in development mode by executing: `npm start`. This command creates an instance of Express that listens on port **9090** by default. You can change this port in the `listen.js` file.

## Minimum Versions

To ensure proper functionality of the API, please verify that you have the following minimum versions installed:

Node.js: `v22.6.0`
pg: `8.7.3`
Express: `4.21.1`

## Usage

To view the available endpoints for the API, you can use the following GET request:

`GET /api`

### Response:

This request will return a list of available endpoints, along with:

- A brief description of the purpose and functionality of each endpoint.
- Acceptable queries that can be used with the endpoints.
- The format of the request body required for each endpoint.
- An example response.

---

This portfolio project was created as part of a Digital Skills Bootcamp in Software Engineering provided by [Northcoders](https://northcoders.com/)
