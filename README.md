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
- the app loads the `.env` file from the backend directory automatically

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

## License

This project is currently under active development and does not yet declare a final public license.

---

For backend-specific setup details, see [backend/README.md](backend/README.md).