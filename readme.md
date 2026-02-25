# CipherSQLStudio

A web-based SQL learning platform where users practice SQL by solving assignments against a live PostgreSQL sandbox. Features query validation, submission tracking, and AI-powered hints via Google Gemini.

**Live Repo:** [github.com/dk-a-dev/sql-learning-platform](https://github.com/dk-a-dev/sql-learning-platform)

## Tech Stack

| Layer    | Technology                                           |
|----------|------------------------------------------------------|
| Frontend | React 19, Vite, Zustand, Axios, Monaco Editor, SCSS |
| Backend  | Node.js, Express 5, Mongoose, pg                     |
| Database | MongoDB (persistence), PostgreSQL (sandbox)          |
| AI       | Google Gemini API                                    |
| Infra    | Docker Compose                                       |

## Architecture

Full architecture diagram available on Excalidraw:
[View Architecture Diagram](https://excalidraw.com/#json=saFUQVYK7qLzm_LDWNQfl,lbEcMWyDDA2dk56Yuxi63w)

The platform uses a three-tier architecture. The React frontend talks to an Express REST API. MongoDB stores users, assignments (with expected solutions), and attempt history. PostgreSQL serves as a sandboxed execution environment for user-submitted SQL queries. Query correctness is validated by comparing user output against the expected solution's output.

## Getting Started

### Prerequisites

- Node.js (v18+)
- Docker and Docker Compose
- A Google Gemini API key

### Backend

```bash
cd backend
cp .env.example .env
```

Fill in the `.env` file:
```
PORT=8000
MONGODB_URI=mongodb://localhost:27017/ciphersqlstudio
DATABASE_URL=postgres://postgres:postgres@localhost:5432/sandbox
GEMINI_API_KEY=your_gemini_api_key
JWT_SECRET=your_jwt_secret
```

Start databases and backend with Docker Compose:
```bash
docker compose up -d
```

This starts PostgreSQL (port 5432), MongoDB (port 27017), and the backend API (port 8000). The PostgreSQL database is auto-seeded with sample data from `init-db/`.

To seed assignments into MongoDB:
```bash
node src/seeds/seedAssignments.js
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

The frontend runs at `http://localhost:5173` and proxies API calls to the backend on port 8000.

## Project Structure

```
backend/
  server.js              -- Express app entry point
  docker-compose.yml     -- PostgreSQL, MongoDB, backend containers
  src/
    controllers/         -- auth, assignments, execute, hints, attempts
    middleware/           -- JWT authentication
    models/              -- User, Assignment, Attempt (Mongoose)
    routes/              -- Express route definitions
    seeds/               -- Assignment seed script
  init-db/               -- PostgreSQL init SQL

frontend/
  src/
    api/                 -- Axios API service modules
    components/          -- Reusable components (workspace, dashboard)
    pages/               -- Auth, Dashboard, Workspace pages
    stores/              -- Zustand stores (auth, assignment, workspace)
    styles/              -- SCSS (variables, mixins, component & page styles)
```

## Screenshots

### Plan
![Plan](screenshots/plan.png)

### DFD
![DFD](screenshots/dfd.png)

### Sequence Diagram
![Sequence Diagram](screenshots/sequence.png)

### High Level Design
![High Level Design](screenshots/hld.png)

### Authentication
![Auth](screenshots/auth.png)

### Dashboard
![Dashboard](screenshots/dashboard.png)

### Assignments
![Assignments](screenshots/assignments.png)

### Workspace
![Workspace](screenshots/workspace.png)

### AI Hint
![Hint](screenshots/hint.png)

### Submission
![Submission](screenshots/submission.png)

### Architecture
![Architecture](screenshots/architecture.png)
