const swaggerDocument = {
  openapi: "3.0.3",
  info: {
    title: "Intro To Backend API",
    version: "1.0.0",
    description: "REST API for users and posts.",
  },
  servers: [
    {
      url: "http://localhost:4000",
      description: "Local development server",
    },
  ],
  tags: [
    { name: "Health", description: "API availability" },
    { name: "Users", description: "Registration and authentication" },
    { name: "Posts", description: "Post management" },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
      cookieAuth: {
        type: "apiKey",
        in: "cookie",
        name: "token",
      },
    },
    schemas: {
      Post: {
        type: "object",
        properties: {
          _id: { type: "string", example: "507f1f77bcf86cd799439011" },
          name: { type: "string", minLength: 2, example: "My first post" },
          description: { type: "string", example: "A useful post" },
          age: { type: "integer", minimum: 1, maximum: 150, example: 25 },
          author: { type: "string", example: "507f1f77bcf86cd799439012" },
        },
      },
      PostInput: {
        type: "object",
        required: ["name", "description", "age"],
        properties: {
          name: { type: "string", minLength: 2, example: "My first post" },
          description: { type: "string", example: "A useful post" },
          age: { type: "integer", minimum: 1, maximum: 150, example: 25 },
        },
      },
      Error: {
        type: "object",
        properties: {
          success: { type: "boolean", example: false },
          message: { type: "string", example: "Invalid request" },
        },
      },
    },
  },
  paths: {
    "/health": {
      get: {
        tags: ["Health"],
        summary: "Check API health",
        responses: {
          200: {
            description: "API is available",
            content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } },
          },
        },
      },
    },
    "/api/v1/users/register": {
      post: {
        tags: ["Users"],
        summary: "Register a user",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["username", "email", "password"],
                properties: {
                  username: { type: "string", minLength: 2, example: "jane" },
                  email: { type: "string", format: "email", example: "jane@example.com" },
                  password: { type: "string", minLength: 6, maxLength: 50, example: "password123" },
                },
              },
            },
          },
        },
        responses: {
          201: { description: "User registered" },
          400: { description: "Invalid input", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } },
          409: { description: "User already exists" },
        },
      },
    },
    "/api/v1/users/login": {
      post: {
        tags: ["Users"],
        summary: "Log in a user",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["email", "password"],
                properties: {
                  email: { type: "string", format: "email", example: "jane@example.com" },
                  password: { type: "string", example: "password123" },
                },
              },
            },
          },
        },
        responses: {
          200: { description: "Login successful; sets the token cookie" },
          401: { description: "Invalid credentials" },
        },
      },
    },
    "/api/v1/posts/create": {
      post: {
        tags: ["Posts"],
        summary: "Create a post",
        security: [{ bearerAuth: [] }, { cookieAuth: [] }],
        requestBody: {
          required: true,
          content: { "application/json": { schema: { $ref: "#/components/schemas/PostInput" } } },
        },
        responses: {
          201: { description: "Post created" },
          401: { description: "Authentication required" },
          400: { description: "Invalid input" },
        },
      },
    },
    "/api/v1/posts/getPosts": {
      get: {
        tags: ["Posts"],
        summary: "List posts",
        parameters: [
          { name: "page", in: "query", schema: { type: "integer", minimum: 1, default: 1 } },
          { name: "limit", in: "query", schema: { type: "integer", minimum: 1, maximum: 100, default: 10 } },
          { name: "search", in: "query", schema: { type: "string" } },
          { name: "sort", in: "query", schema: { type: "string", enum: ["newest", "oldest"], default: "newest" } },
        ],
        responses: { 200: { description: "Posts returned" }, 400: { description: "Invalid query" } },
      },
    },
    "/api/v1/posts/{id}": {
      get: {
        tags: ["Posts"],
        summary: "Get one post",
        parameters: [{ $ref: "#/components/parameters/postId" }],
        responses: { 200: { description: "Post returned" }, 400: { description: "Invalid ID" }, 404: { description: "Post not found" } },
      },
    },
    "/api/v1/posts/updatePost/{id}": {
      patch: {
        tags: ["Posts"],
        summary: "Update an owned post",
        security: [{ bearerAuth: [] }, { cookieAuth: [] }],
        parameters: [{ $ref: "#/components/parameters/postId" }],
        requestBody: {
          required: true,
          content: { "application/json": { schema: { $ref: "#/components/schemas/PostInput" } } },
        },
        responses: { 200: { description: "Post updated" }, 401: { description: "Authentication required" }, 403: { description: "Not the post owner" }, 404: { description: "Post not found" } },
      },
    },
    "/api/v1/posts/deletePost/{id}": {
      delete: {
        tags: ["Posts"],
        summary: "Delete an owned post",
        security: [{ bearerAuth: [] }, { cookieAuth: [] }],
        parameters: [{ $ref: "#/components/parameters/postId" }],
        responses: { 200: { description: "Post deleted" }, 401: { description: "Authentication required" }, 403: { description: "Not the post owner" }, 404: { description: "Post not found" } },
      },
    },
  },
};

swaggerDocument.components.parameters = {
  postId: {
    name: "id",
    in: "path",
    required: true,
    schema: { type: "string", pattern: "^[a-fA-F0-9]{24}$" },
    example: "507f1f77bcf86cd799439011",
  },
};

export default swaggerDocument;
