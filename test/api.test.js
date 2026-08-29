import assert from "node:assert/strict";
import { after, before, describe, it } from "node:test";
import app from "../backend/src/app.js";

let server;
let baseUrl;
// Start the server on a random available port before running tests .
before(async () => {
  server = app.listen(0);
  await new Promise((resolve) => server.once("listening", resolve));
  baseUrl = `http://127.0.0.1:${server.address().port}`;
});

// Close the server after all tests have completed
after(async () => {
  await new Promise((resolve, reject) => {
    server.close((error) => (error ? reject(error) : resolve()));
  });
});

// Helper function to make HTTP requests to the server
const request = (path, options) => fetch(`${baseUrl}${path}`, options);

describe("API", () => {
  it("reports that the API is healthy", async () => {
    const response = await request("/health");

    assert.equal(response.status, 200);
    assert.deepEqual(await response.json(), {
      success: true,
      message: "API is healthy",
    });
  });

  it("rejects invalid registration data", async () => {
    const response = await request("/api/v1/users/register", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ username: "a", email: "invalid", password: "123" }),
    });

    assert.equal(response.status, 400);
    assert.deepEqual(await response.json(), {
      success: false,
      message: "Username must be at least 2 characters",
    });
  });

  it("rejects unauthenticated post creation", async () => {
    const response = await request("/api/v1/posts/create", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ name: "Test", description: "Test post", age: 20 }),
    });

    assert.equal(response.status, 401);
    assert.deepEqual(await response.json(), {
      success: false,
      message: "Authentication required",
    });
  });

  it("rejects invalid pagination queries", async () => {
    const response = await request("/api/v1/posts/getPosts?limit=101");

    assert.equal(response.status, 400);
    assert.deepEqual(await response.json(), {
      success: false,
      message: "Limit must be an integer between 1 and 100",
    });
  });

  it("returns 404 for unknown routes", async () => {
    const response = await request("/api/v1/unknown");

    assert.equal(response.status, 404);
    assert.equal((await response.json()).success, false);
  });
});