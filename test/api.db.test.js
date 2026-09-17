import "dotenv/config";
import assert from "node:assert/strict";
import { after, before, describe, it } from "node:test";
import mongoose from "mongoose";
import app from "../backend/src/app.js";

const shouldRun = process.env.RUN_DB_TESTS === "true" && process.env.MONGODB_URI;
const test = shouldRun ? it : it.skip;
let server;
let baseUrl;
let janeCookie;
let johnCookie;
let janePostId;

const request = (path, options = {}) => fetch(`${baseUrl}${path}`, options);
const jsonRequest = (path, method, body, cookie) => request(path, {
  method,
  headers: {
    "content-type": "application/json",
    ...(cookie ? { cookie } : {}),
  },
  body: JSON.stringify(body),
});

const login = async (email, password) => {
  const response = await jsonRequest("/api/v1/users/login", "POST", { email, password });
  assert.equal(response.status, 200);
  return response.headers.get("set-cookie").split(";")[0];
};

describe("API with MongoDB", () => {
  before(async () => {
    if (!shouldRun) return;
    await mongoose.connect(process.env.MONGODB_URI);
    server = app.listen(0);
    await new Promise((resolve) => server.once("listening", resolve));
    baseUrl = `http://127.0.0.1:${server.address().port}`;

    const suffix = Date.now();
    await jsonRequest("/api/v1/users/register", "POST", {
      username: `jane${suffix}`,
      email: `jane${suffix}@example.com`,
      password: "password123",
    });
    await jsonRequest("/api/v1/users/register", "POST", {
      username: `john${suffix}`,
      email: `john${suffix}@example.com`,
      password: "password123",
    });
    janeCookie = await login(`jane${suffix}@example.com`, "password123");
    johnCookie = await login(`john${suffix}@example.com`, "password123");
  });

  after(async () => {
    if (!shouldRun) return;
    await new Promise((resolve) => server.close(resolve));
    await mongoose.connection.close();
  });

  test("creates and reads a post", async () => {
    const createResponse = await jsonRequest("/api/v1/posts/create", "POST", {
      name: `Jane post ${Date.now()}`,
      description: "Database integration test post",
      age: 25,
    }, janeCookie);
    assert.equal(createResponse.status, 201);
    janePostId = (await createResponse.json()).data._id;
    assert.ok(janePostId);
  });

  test("rejects another user from updating the post", async () => {
    const response = await jsonRequest(`/api/v1/posts/updatePost/${janePostId}`, "PATCH", { age: 30 }, johnCookie);
    assert.equal(response.status, 403);
  });

  test("prevents mass-assignment of author during update", async () => {
    const updateResponse = await jsonRequest(`/api/v1/posts/updatePost/${janePostId}`, "PATCH", {
      age: 27,
      author: "000000000000000000000000",
    }, janeCookie);
    assert.equal(updateResponse.status, 200);
    const updatedData = (await updateResponse.json()).data;
    assert.notEqual(String(updatedData.author), "000000000000000000000000");
  });

  test("safely handles special regex characters in search query", async () => {
    const response = await request("/api/v1/posts/getPosts?search=[.*+?^${}()");
    assert.equal(response.status, 200);
    const result = await response.json();
    assert.equal(result.success, true);
  });

  test("allows the owner to update and delete the post", async () => {
    const updateResponse = await jsonRequest(`/api/v1/posts/updatePost/${janePostId}`, "PATCH", { age: 26 }, janeCookie);
    assert.equal(updateResponse.status, 200);

    const deleteResponse = await jsonRequest(`/api/v1/posts/deletePost/${janePostId}`, "DELETE", {}, janeCookie);
    assert.equal(deleteResponse.status, 200);
  });
});
