# MyBlog - Full-Stack Blog Application

A full-stack blog with a React frontend and a Node.js API. Visitors can read published posts without an account. Writing, editing, and the profile dashboard require a login.

The interface is in Turkish.

## Features

- **Public reading**: The feed and post pages are open. Drafts stay private to the author.
- **Authentication**: Registration and login with JWT. The session survives a page refresh.
- **Posts**: Create, edit, delete, and publish. Each post has a slug, status, publish date, and estimated reading time.
- **Editor**: Dark writing surface with a live preview. Line breaks are kept on the detail page.
- **Cover images**: Upload a file (stored by the API) or paste an external image URL.
- **Feed**: Cards with optional cover, title, teaser, author, and date. Signed-in users also see a “new post” card.
- **Profile**: Display name, avatar, bio, and counts for all, published, and draft posts. Filter the list by status.
- **Dark UI**: One dark theme across the app.

## Tech Stack

### Frontend
- React 19
- React Router DOM
- Axios
- React Toastify

### Backend
- Node.js
- Express.js
- JWT
- Bcrypt.js
- Multer for cover images
- PostgreSQL via `pg`, run in Docker

## Prerequisites

- Node.js 18 or newer
- npm
- Docker Desktop
- Git

## Quick Start

### 1. Clone the repository

```bash
git clone https://github.com/furblood0/my-blog-project.git
cd my-blog-project
```

### 2. Install dependencies

```bash
npm run install-all
```

### 3. Start PostgreSQL

```bash
docker compose up -d
```

On first start, `db-init/database-schema-postgres.sql` creates the tables.

To wipe the database volume and start over:

```bash
docker compose down -v
docker compose up -d
```

### 4. Environment

Backend:

```bash
cd blog-backend
cp env.example .env
```

`blog-backend/env.example` already matches the Docker database user. Change `JWT_SECRET` before you share a deployment.

Frontend (optional; the app falls back to `http://localhost:5000/api`):

```bash
cd frontend
cp env.example .env
```

```env
REACT_APP_API_URL=http://localhost:5000/api
```

Set this at build time if the API is not on localhost.

### 5. Sample posts

From the repository root, after the database is up:

```bash
npm run seed
```

This creates two local accounts and four published posts. Safe to run again; it does not overwrite an existing account’s password.

| Email | Password |
| --- | --- |
| demo@myblog.local | demo1234 |
| elif@myblog.local | demo1234 |

These accounts are for local demos only.

### 6. Start the app

```bash
npm run dev
```

- Frontend: http://localhost:3000
- API: http://localhost:5000
- Uploaded images: http://localhost:5000/uploads/...

Or start them separately with `npm run start-backend` and `npm run start-frontend`.

## Project structure

```
my-blog-project/
├── blog-backend/
│   ├── config/db.js
│   ├── middleware/auth.js
│   ├── scripts/seed.js
│   ├── uploads/
│   ├── server.js
│   └── env.example
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── services/
│   │   ├── config.js
│   │   └── App.js
│   └── env.example
├── db-init/
│   └── database-schema-postgres.sql
├── docker-compose.yml
└── package.json
```

## Scripts

From the repository root:

- `npm run install-all` — install root, frontend, and backend dependencies
- `npm run dev` — start the API and the frontend
- `npm run start-backend` — API only
- `npm run start-frontend` — frontend only
- `npm run seed` — insert the demo users and posts
- `npm run build` — production build of the frontend

## API

### Authentication
- `POST /api/register`
- `POST /api/login`

### Posts
- `GET /api/posts` — published posts
- `GET /api/posts/:id` — one post; drafts only for the author
- `POST /api/posts` — authenticated
- `PUT /api/posts/:id` — authenticated author
- `DELETE /api/posts/:id` — authenticated author
- `POST /api/uploads/image` — authenticated cover upload

### Profile
- `GET /api/users/:id/profile` — the signed-in user’s own profile and posts

## Deployment

Build the frontend with `REACT_APP_API_URL` pointing at the public API, then host the `frontend/build` folder. The API needs PostgreSQL, a real `JWT_SECRET`, and a persistent place for `blog-backend/uploads` if you keep file uploads.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md).

## License

MIT. See [LICENSE](LICENSE).

## Author

**Furkan Fidan**
- GitHub: [@furblood0](https://github.com/furblood0)
