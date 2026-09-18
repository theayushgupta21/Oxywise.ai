# Oxywise Backend

This folder contains the backend service for Oxywise.ai. It handles authentication, MongoDB access, AI-powered recommendations, chat flows, and Socket.IO real-time communication.

## Tech Stack

- Node.js
- Express
- MongoDB + Mongoose
- JWT authentication
- Google OAuth integration
- Socket.IO
- Groq/OpenAI-compatible AI integration

## Project Structure

```bash
backend/
├── src/
│   ├── app.js
│   ├── server.js
│   ├── config/
│   ├── controllers/
│   ├── middlewares/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── sockets/
│   └── utils/
├── routes/
├── package.json
└── README.md
```

## Required Environment Variables

Create a file named `.env` inside the `backend` folder:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/oxywise
JWT_SECRET=your_secure_jwt_secret
GOOGLE_CLIENT_ID=your_google_client_id
GROQ_API_KEY=your_groq_api_key
```

The server startup code validates the presence of:

- `MONGODB_URI`
- `JWT_SECRET`
- `GOOGLE_CLIENT_ID`
- `GROQ_API_KEY`

`GROQ_API_KEY` is also checked to ensure it is not blank and does not contain whitespace.

## Local Development

Install dependencies:

```bash
npm install
```

Start the server in development mode:

```bash
npm run dev
```

Or run it directly:

```bash
npm run start
```

The server starts on the port from `PORT` or defaults to `5000`.

## Notes

- The backend loads the environment file from `backend/.env` automatically.
- Socket.IO is initialized on the Express server.
- The app performs DB connection and environment validation during startup.
- Logs are printed for key configuration diagnostics, including whether the Groq key was loaded successfully.

## Current Backend Responsibilities

- user registration / login
- JWT auth middleware
- protected routes
- plant and knowledge processing
- chat handling and AI responses
- socket-based real-time chat
- MongoDB persistence for app data
