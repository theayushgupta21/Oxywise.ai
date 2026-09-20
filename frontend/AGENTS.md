<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Oxywise.ai Project And Interview Guide

This file is the frontend-scoped summary of the complete Oxywise.ai project. Use it when modifying the web client, explaining the architecture in an interview, or tracking a production issue. The product is an AI-powered plant companion that recommends plants using user context, location, weather, and plant-care knowledge.

## One-Minute Summary

Oxywise.ai is a full-stack plant recommendation and AI chat platform. The web client uses **Next.js, React, TypeScript, Tailwind CSS, Framer Motion, Three.js, React Three Fiber, Drei, Zustand, and Socket.IO Client**. The API uses **Node.js, Express, MongoDB, Mongoose, JWT, Google OAuth verification, Socket.IO, Groq/OpenAI-compatible services, embeddings, and weather APIs**. The web frontend is deployed on **Vercel**, the backend on **Railway**, and data is stored in **MongoDB Atlas**. A separate **Expo 54, React Native, Expo Router, and TypeScript** mobile client exists under `OxywiseApp/OxywisefrontendApp`.

## Product Capabilities

- Plant recommendations based on climate, weather, location, and home conditions. **Technology highlight: Node.js/Express services, weather integration, plant matching, MongoDB/Mongoose models.**
- AI-assisted plant-care and recommendation chat. **Technology highlight: Socket.IO for real-time transport, Groq/OpenAI-compatible services for AI responses, and React state management with Zustand.**
- Google OAuth and email/password authentication. **Technology highlight: Google Identity Services in React, backend Google token verification, JWT sessions, and protected Express routes.**
- Interactive web presentation with a garden-inspired visual experience. **Technology highlight: Next.js client components, Tailwind CSS, Framer Motion, Three.js, React Three Fiber, and Drei.**
- Native mobile product shell for Android, iOS, and Expo web. **Technology highlight: Expo 54, React Native, Expo Router, Reanimated, and TypeScript.**

## Repository Architecture

```text
oxywise.Ai/
├── frontend/                     # Next.js web client
│   ├── app/                      # App Router pages and layouts
│   ├── components/               # Auth, layout, and shared React components
│   ├── lib/                      # API helpers
│   ├── store/                    # Zustand client state and Socket.IO connection
│   ├── views/                    # Page-level and chat UI
│   └── AGENTS.md                 # This frontend and interview guide
├── backend/                     # Node.js/Express API
│   └── src/
│       ├── routes/               # Express route registration
│       ├── controllers/          # Request and response logic
│       ├── services/             # Google, AI, weather, embedding, and matching logic
│       ├── models/               # Mongoose schemas
│       ├── middlewares/          # Auth, errors, and rate limiting
│       └── sockets/              # Socket.IO chat handlers
├── OxywiseApp/                  # Mobile workspace
│   └── OxywisefrontendApp/      # Expo Router mobile client
└── AGENTS.md                    # Repository-wide agent workflow
```

## Web Frontend Stack

### Next.js And React

**Next.js** provides the application framework, App Router, layouts, route-level pages, and production build. **React** provides component composition, hooks, context, and client-side interaction. Pages that use browser APIs, authentication state, or interactive UI are marked with `"use client"`.

### TypeScript

**TypeScript** defines safer contracts for auth users, chat messages, chat history, API responses, and component props. Keep public types near the feature that owns them and avoid weakening types with `any` unless an external library requires it.

### Tailwind CSS

**Tailwind CSS** supplies utility-first styling for layout, spacing, responsive breakpoints, colors, borders, and states. Existing frontend styling uses a calm plant-oriented palette with green surfaces, light backgrounds, and compact rounded controls.

### Framer Motion

**Framer Motion** provides entrance, hover, and tap animations on authentication and landing-page surfaces. Motion should support hierarchy and feedback without making the chatbot workflow slower or distracting.

### Three.js, React Three Fiber, And Drei

**Three.js** provides browser 3D rendering. **React Three Fiber** exposes Three.js through React components, and **Drei** supplies reusable helpers. The auth pages use a client-only garden background because WebGL should not be rendered during server-side rendering.

### Zustand And Socket.IO Client

**Zustand** stores chat messages, history, active chat state, input state, attachment state, and UI toggles without a large global Redux-style architecture. **Socket.IO Client** connects the browser to the Railway backend for authenticated real-time chat, using `NEXT_PUBLIC_SOCKET_URL`.

## Backend Stack

**Node.js** runs the server using ES modules. **Express** handles HTTP middleware, CORS, JSON parsing, route registration, and error handling. **MongoDB** stores application data, while **Mongoose** defines and queries User, Chat, Message, Plant, and KnowledgeChunk models. **JWT** provides application session tokens after local or Google authentication.

**Google OAuth** is split into two responsibilities: the browser receives a Google credential through `@react-oauth/google`, and the backend verifies the ID token with `google-auth-library`. **Groq/OpenAI-compatible services** support AI responses, **embeddings** support retrieval-oriented knowledge workflows, and **weather services** provide environmental context for plant matching.

## Important Web Files

- `app/layout.tsx`: Root layout, global providers, fonts, and application shell. **Stack: Next.js App Router and React.**
- `app/page.tsx`: Public home route composition. **Stack: Next.js routing and React views.**
- `app/login/page.tsx` and `app/signup/page.tsx`: Authentication routes. **Stack: Next.js, React, Google OAuth, JWT API integration.**
- `app/chatbot/page.tsx`: Authenticated chatbot entry point. **Stack: Next.js client rendering and AuthProvider session state.**
- `components/providers/AuthProvider.tsx`: Restores `/api/auth/me`, stores the JWT in browser storage, and exposes login/logout state. **Stack: React Context, Google OAuth provider, and API helpers.**
- `components/layouts/Navbar.tsx`: Home navigation and authenticated profile menu. **Stack: React state, Next Link, and React Icons.**
- `lib/api.ts`: Central API client for auth and session requests. **Stack: Fetch API, TypeScript, and environment-based URLs.**
- `store/useChatStore.ts`: Chat state and Socket.IO connection. **Stack: Zustand, Socket.IO Client, TypeScript.**
- `views/chat/ChatWindow.tsx`: Chat messages, quick prompts, responsive header, and profile control. **Stack: React hooks, Tailwind CSS, Lucide icons, and AuthProvider.**
- `views/chat/Sidebar.tsx`: Chat history, new-chat action, and responsive sidebar. **Stack: Zustand, Tailwind CSS, Lucide icons, and Next Link.**

## Core Request Flows

### Google Authentication

1. The user opens the Next.js login or signup page.
2. `GoogleLogin` from `@react-oauth/google` returns a Google ID token.
3. `googleAuthApi()` sends `POST /api/auth/google` to the public Railway URL.
4. Express mounts `/api/auth` and `authRoutes.js` resolves `/google`.
5. `authController.js` calls the Google verification service.
6. The backend finds or creates a Mongoose User document in MongoDB Atlas.
7. The backend returns a JWT and user object.
8. `AuthProvider` stores the JWT and restores it later through `GET /api/auth/me`.

**Interview highlight:** Google proves identity, but the application still creates its own JWT session and user record. OAuth credentials and application authorization are separate concerns.

### Real-Time Chat

1. The authenticated chatbot mounts and calls `connect()` from Zustand.
2. The client reads `NEXT_PUBLIC_SOCKET_URL` and sends the JWT during the Socket.IO handshake.
3. The backend validates the connection and registers chat socket handlers.
4. User messages are emitted through Socket.IO.
5. Backend services can combine chat context, weather data, plant knowledge, and AI responses.
6. The server emits typing, message, chat-created, and error events back to the client.

**Interview highlight:** HTTP is used for authentication and REST-style operations, while Socket.IO is used for low-latency bidirectional chat events.

### Production Deployment

The browser loads the Next.js bundle from **Vercel**. The frontend calls the public **Railway** backend, which connects to **MongoDB Atlas** and external AI/weather providers. Production frontend variables are embedded during the Vercel build, so changing `NEXT_PUBLIC_*` variables requires a new deployment. Railway must use its dynamic `PORT`, public hostname, and production `CLIENT_URL` for CORS.

Required URL shapes:

```env
NEXT_PUBLIC_API_URL=https://<public-railway-domain>
NEXT_PUBLIC_SOCKET_URL=https://<public-railway-domain>
CLIENT_URL=https://<public-vercel-domain>
```

Do not use `localhost`, `*.railway.internal`, a Vercel URL as the API URL, or append `/api` to `NEXT_PUBLIC_API_URL`; the frontend builds paths such as `/api/auth/google` itself.

## Interview Talking Points

- **Why Next.js?** It provides the React application framework, App Router, production bundling, and a clear route/layout structure.
- **Why TypeScript?** It catches mismatches across API responses, auth state, chat messages, and component props before runtime.
- **Why Zustand?** Chat state is localized and event-driven, so a small store is simpler than introducing a larger state framework.
- **Why Socket.IO?** Chat requires bidirectional events, reconnection, typing indicators, and authenticated room behavior.
- **Why JWT?** The backend needs a stateless application session after Google or local credential verification.
- **How is OAuth secured?** The browser sends the Google ID token to the backend; the backend verifies its audience and signature before using the profile.
- **How is deployment debugged?** Inspect the actual browser request URL first, then health endpoint, route registration, CORS, deployed commit, environment variables, and only then provider/database logic.
- **How do you avoid secrets?** Keep secrets in Vercel/Railway environment settings, never print them in logs, and never commit local environment files.

## Agent Working Process

1. Read the relevant Next.js version documentation before changing framework behavior. **Technology: Next.js.**
2. Identify the owning component, store, API helper, route, or service. **Technology: React, Zustand, Fetch, Express.**
3. State one testable hypothesis and one cheap check before editing. **Practice: production debugging.**
4. Make the smallest focused change. **Practice: maintainable TypeScript and component design.**
5. Run lint, typecheck, build, or a focused test immediately. **Tools: ESLint, TypeScript, Next.js build.**
6. For production issues, compare browser Network requests, Vercel build variables, Railway logs, CORS, and deployed commit. **Infrastructure: Vercel, Railway, MongoDB Atlas.**
7. Verify both desktop and mobile states for UI work. **Technology: Tailwind responsive utilities, React, Expo where applicable.**

For the repository-wide level-by-level debugging workflow and reusable analysis/tracking prompts, read the root [AGENTS.md](../AGENTS.md).
