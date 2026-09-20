# 🌿 Oxywise.ai

Oxywise.ai is an AI-powered plant recommendation platform that helps users choose the right greenery for their home based on location, weather, climate, and lifestyle. The project combines a Next.js frontend with a Node.js/Express backend, MongoDB data storage, and AI-powered plant suggestions.

## Overview

The app is designed to help people:

- choose plants that fit their local climate and home conditions
- receive personalized plant-care guidance
- use weather-aware recommendations for healthier greenery
- interact with a chatbot for plant and home-environment advice

## Features

- AI-assisted plant suggestions based on user input and conditions
- Weather-aware and location-aware recommendations
- Authentication and user management
- Chat support for plant guidance and care questions
- Real-time socket-based chat experience
- Authenticated chatbot profile menu with home, profile, and logout actions
- MongoDB-backed persistence for users, chats, and plant-related data

## Tech Stack

- Frontend: Next.js + React + TypeScript
- Styling: Tailwind CSS
- Backend: Node.js + Express
- Database: MongoDB + Mongoose
- AI: Groq/OpenAI-compatible integration
- Real-time layer: Socket.IO
- Auth: JWT + Google OAuth

## Project Structure

```bash
oxywise.Ai/
├── backend/
│   ├── src/
│   ├── routes/
│   ├── .env.example (if present locally)
│   ├── package.json
│   └── README.md
├── frontend/
│   ├── app/
│   ├── components/
│   ├── lib/
│   ├── store/
│   ├── views/
│   └── package.json
├── README.md
└── OxywiseApp/
    ├── OxywisebackendApp/
    └── OxywisefrontendApp/
```

## Environment Setup

Create a backend environment file at `backend/.env` with the required variables:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/oxywise
JWT_SECRET=your_jwt_secret
GOOGLE_CLIENT_ID=your_google_client_id
GROQ_API_KEY=your_groq_api_key
```

Important notes:

- the backend validates required variables on startup
- `GROQ_API_KEY` must be present and cannot contain whitespace
- the app loads `backend/.env` automatically for local development
- deployment-provided environment variables are preserved and take precedence over local `.env` values

### Frontend environment variables

For local development, create `frontend/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_SOCKET_URL=http://localhost:5000
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id
```

For Vercel, configure these variables in the project settings and redeploy after changing them:

```env
NEXT_PUBLIC_API_URL=https://your-public-railway-domain
NEXT_PUBLIC_SOCKET_URL=https://your-public-railway-domain
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id
```

The API and Socket.IO URLs must include `https://` in production and must point to the public Railway domain. Do not use a Railway internal hostname or append `/api`; the frontend adds the `/api` path itself.

For Railway, configure:

```env
CLIENT_URL=https://your-vercel-domain
```

This origin must match the deployed frontend URL so browser API requests and Socket.IO connections pass CORS checks.

## Getting Started

### 1) Backend

```bash
cd backend
npm install
npm run dev
```

The backend server runs on:

- http://localhost:5000

### 2) Frontend

```bash
cd frontend
npm install
npm run dev
```

The frontend app runs on:

- http://localhost:3000

## Scripts

### Backend

```bash
npm run dev   # runs with nodemon
npm run start # runs the production server
```

### Frontend

```bash
npm run dev
npm run build
npm run start
npm run lint
```

## Status

The project is actively under development and includes both frontend and backend foundations, user authentication, chat, and AI-powered recommendation support.

## AI Agent Workflow

Repository-wide AI coding and production-debugging guidance is documented in [AGENTS.md](AGENTS.md). It defines a level-by-level process for analyzing requests, tracing Vercel-to-Railway failures, checking authentication and Socket.IO configuration, making minimal changes, and tracking evidence without exposing secrets.

Use the reusable analysis and tracking prompts in that guide when investigating a new issue. Frontend and mobile work should also follow their scoped guidance in [frontend/AGENTS.md](frontend/AGENTS.md) and [OxywiseApp/OxywisefrontendApp/AGENTS.md](OxywiseApp/OxywisefrontendApp/AGENTS.md).

## License

This project is currently under active development and does not yet declare a final public license.

---

For backend-specific setup details, see [backend/README.md](backend/README.md).