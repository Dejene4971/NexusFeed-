# Intro To Backend API

## Setup

Install dependencies:

```powershell
npm install
```

Create a `.env` file in the project root:

```env
PORT=4000
MONGODB_URI=mongodb://127.0.0.1:27017/intro_backend
JWT_SECRET=replace-with-a-long-random-secret
```

Start the API:

```powershell
npm run dev
```

## Endpoints

| Method | Endpoint | Description | Auth |
| --- | --- | --- | --- |
| GET | `/health` | Check API availability | No |
| POST | `/api/v1/users/register` | Register a user | No |
| POST | `/api/v1/users/login` | Log in and receive a cookie | No |
| POST | `/api/v1/users/logout` | Clear the login cookie | No |
| POST | `/api/v1/posts/create` | Create a post | Yes |
| GET | `/api/v1/posts/getPosts` | List posts | No |
| GET | `/api/v1/posts/:id` | Get one post | No |
| PATCH | `/api/v1/posts/updatePost/:id` | Update an owned post | Yes |
| DELETE | `/api/v1/posts/deletePost/:id` | Delete an owned post | Yes |

Protected requests can use the login cookie or this header:

```text
Authorization: Bearer <jwt>
```

## Post Listing

```text
GET /api/v1/posts/getPosts?page=1&limit=10&search=hello&sort=newest
```

- `page`: Positive page number, default `1`
- `limit`: Number of posts from `1` to `100`, default `10`
- `search`: Searches post names and descriptions
- `sort`: `newest` or `oldest`

## Testing

Open the interactive Swagger documentation while the API is running:

```text
http://localhost:4000/api-docs
```

Use the **Authorize** button to provide a JWT bearer token when testing protected endpoints.

Run the database-independent API tests:

```powershell
npm test
```

Run the CRUD and ownership tests against MongoDB:

```powershell
npm run test:db
```

The database test command requires a reachable `MONGODB_URI`. Use a separate test database to avoid changing development data.

## Frontend (React + Vite)

The frontend is built with React 19, Vite, and custom CSS design system located in `/frontend`.

### Running the Frontend

Install dependencies (if not already installed):

```powershell
cd frontend
npm install
```

Start the Vite development server with proxy:

```powershell
npm run dev
```

Or from the project root:

```powershell
npm run dev:frontend
```

Open `http://localhost:5173` in your browser.

### Frontend Features

- **JWT Authentication Flow**: Tabbed Modal supporting Registration, Login, and secure session persistence in `localStorage`.
- **Full CRUD Feed**:
  - Browse public posts with server-side pagination (Next/Prev and page buttons).
  - Search filter with debouncing matching post title and description.
  - Sort toggle (`newest` / `oldest`).
  - Read full post details modal with author and metadata.
  - Create new posts with client-side validation.
  - Edit and Delete posts (restricted to author-owned posts).
- **Live Health Monitoring**: Real-time ping to the `/health` endpoint displaying connection status and latency.
- **Modern Theme System**: One-click light/dark mode switcher with glassmorphism aesthetics and custom typography (Outfit & Inter).
- **Toast Notifications**: Interactive status alerts for all actions.
