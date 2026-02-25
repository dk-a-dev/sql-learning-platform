# CipherSQLStudio - Repository Guide

This document is intended for AI agents working on this codebase. It describes the project structure, conventions, and architecture so that agents can make informed changes without breaking things.

## Project Overview

CipherSQLStudio is a web-based SQL learning platform where students practice SQL by solving preset assignments against a live PostgreSQL sandbox. The backend validates query correctness by comparing user results against expected solutions and tracks submission history. An AI hint system powered by Google Gemini provides contextual help.

## Repository Structure

```
sql-learning-platform/
  backend/             -- Node.js + Express API server
    docker-compose.yml -- Spins up PostgreSQL, MongoDB, and the backend
    server.js          -- Entry point, Express app setup
    src/
      controllers/     -- Route handlers (auth, assignments, execute, hints, attempts)
      middleware/       -- JWT auth middleware
      models/          -- Mongoose schemas (User, Assignment, Attempt)
      routes/          -- Express route definitions
      seeds/           -- MongoDB seed script for preset assignments
    init-db/           -- SQL init script mounted into PostgreSQL container
  frontend/            -- React + Vite SPA
    src/
      api/             -- Axios-based API service modules
      components/      -- Reusable UI components (workspace/, dashboard/)
      pages/           -- Page-level components (Auth, Dashboard, Workspace)
      stores/          -- Zustand state management stores
      styles/          -- Global SCSS (variables, mixins, component styles, page styles)
  screenshots/         -- UI screenshots for documentation
```

## Tech Stack

- Frontend: React 19, Vite, Zustand (state), Axios (HTTP), Monaco Editor (SQL editing), SCSS, Lucide React (icons)
- Backend: Express 5, Mongoose (MongoDB ODM), pg (PostgreSQL client), bcryptjs, jsonwebtoken, @google/genai
- Databases: MongoDB (users, assignments, attempts), PostgreSQL (sandbox query execution)
- Infra: Docker Compose for local development

## Architecture

The system follows a standard three-tier architecture:

1. Client Layer - React SPA communicates with the backend via REST APIs. State is managed with Zustand stores (useAuthStore, useAssignmentStore, useWorkspaceStore). The Monaco editor provides the SQL editing experience.

2. Application Layer - Express server with controller/route pattern. Five main domains: auth, assignments, execution, hints, and attempts. JWT middleware protects authenticated routes.

3. Data Layer - MongoDB stores users, assignments (with expected solutions), and attempt history. PostgreSQL acts as a sandboxed execution environment where user queries run against seeded sample data. The Gemini API is called for hint generation.

Query validation works by executing both the user query and the expected solution query against PostgreSQL, then comparing the result sets.

## Key Conventions

- No emojis in code or documentation.
- SCSS uses a centralized styles directory at frontend/src/styles/ with subdirectories for components and pages. Variables and mixins are defined in _variables.scss and _mixins.scss.
- Components import their styles from the global styles directory, not co-located files. Example: a component at components/workspace/ResultsPanel.jsx imports from styles/components/workspace/ResultsPanel.scss.
- Backend follows controller/route separation. Route files define Express routes and delegate to controller functions.
- Environment variables: PORT, MONGODB_URI, DATABASE_URL (PostgreSQL), GEMINI_API_KEY, JWT_SECRET. See backend/.env.example.

## Running Locally

Backend (with Docker):
```
cd backend
docker compose up -d
```
This starts PostgreSQL (port 5432), MongoDB (port 27017), and the backend API (port 8000).

Frontend:
```
cd frontend
npm install
npm run dev
```
Runs on http://localhost:5173 by default.

## Common Tasks

- Adding a new assignment: Add to the seed script in backend/src/seeds/ and re-run it.
- Adding a new API endpoint: Create controller in backend/src/controllers/, add route in backend/src/routes/, register in server.js.
- Adding a new frontend component: Create JSX in frontend/src/components/, create SCSS in frontend/src/styles/components/, import the style in the component.
- Adding a new page: Create JSX in frontend/src/pages/, create SCSS in frontend/src/styles/pages/, add route in the router.
