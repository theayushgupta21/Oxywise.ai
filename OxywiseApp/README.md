# 🌿 Oxywise.ai — Mobile App

> Grow the right plants, right where you live. Now in your pocket.

The mobile client for **Oxywise.ai**, built with **Expo** (React Native) for **iOS and Android**, sharing the same backend API as the web app.

## About

This app gives users AI-powered plant and home-greening suggestions based on their location, real-time weather, and living space — with the same accuracy-first, RAG-grounded AI assistant as the web app, adapted for a native mobile experience.

## Status

🚧 **Early stage.** Scaffolding and screen-by-screen build in progress. Starting with one core screen first before expanding to the full app.

## Tech Stack (planned)

- **Expo** (managed workflow, run via Expo Go for development)
- **React Native** + TypeScript
- **Expo Router** (file-based navigation, to match the web app's routing mental model)
- **Zustand** (state management — same store pattern as web where possible)
- **socket.io-client** (real-time chat, connecting to the same Railway backend)
- Shared backend: same REST API and Socket.io events as the web app (`/api/auth/*`, `/api/chats/*`, `join_chat`, `send_message`, etc.)

## Relationship to the Web App

This app is a **separate client**, not a port — it talks to the exact same backend (`backend/` on Railway). Auth (email/password + Google Sign-In), chat history, and AI responses are all shared with the web experience; only the UI layer is native.

```
Oxywise.ai
├── frontend/                    → Web client (Next.js, Vercel)
├── backend/                     → Shared API (Express, Railway)
└── OxywiseApp/
    └── OxywisefrontendApp/      → Mobile client (Expo, this app)
```

## Getting Started

```bash
npm install
npx expo start
```

Scan the QR code with the **Expo Go** app on your phone (iOS or Android) to run it live during development.

### Environment variables

Create a `.env` (or use `app.config.js`/`eas.json` extra fields, per Expo convention) with:

```
EXPO_PUBLIC_API_URL=https://<railway-backend-domain>
EXPO_PUBLIC_SOCKET_URL=https://<railway-backend-domain>
EXPO_PUBLIC_GOOGLE_CLIENT_ID=<google client id>
```

For local backend testing, point these to your machine's local IP (not `localhost`) so a physical device running Expo Go can reach it, e.g. `http://192.168.x.x:5000`.

## Build Plan

Screens are being built one at a time rather than scaffolding everything up front:

- [ ] First screen (TBD — decide and build)
- [ ] Login / Signup
- [ ] Chatbot (AI assistant)
- [ ] Home / plant suggestions
- [ ] Profile

## Notes for Contributors / AI Agents

- This folder has its own `AGENTS.md` for mobile-specific working instructions.
- Do not duplicate backend logic here — this app only consumes the existing API and Socket.io events documented in the main project `README.md`.
- Keep brand tokens (colors, fonts) consistent with the web app: primary green `#4A7C1F`, ocean blue `#185FA5`, amber `#E8951F`, sage backgrounds `#EAF3DE`/`#F7F9F2`; Gelasio for headings, Poppins for body (use React Native-compatible font loading via `expo-font`).

## License

TBD# 🌿 Oxywise.ai — Mobile App

> Grow the right plants, right where you live. Now in your pocket.

The mobile client for **Oxywise.ai**, built with **Expo** (React Native) for **iOS and Android**, sharing the same backend API as the web app.

## About

This app gives users AI-powered plant and home-greening suggestions based on their location, real-time weather, and living space — with the same accuracy-first, RAG-grounded AI assistant as the web app, adapted for a native mobile experience.

## Status

🚧 **Early stage.** Scaffolding and screen-by-screen build in progress. Starting with one core screen first before expanding to the full app.

## Tech Stack (planned)

- **Expo** (managed workflow, run via Expo Go for development)
- **React Native** + TypeScript
- **Expo Router** (file-based navigation, to match the web app's routing mental model)
- **Zustand** (state management — same store pattern as web where possible)
- **socket.io-client** (real-time chat, connecting to the same Railway backend)
- Shared backend: same REST API and Socket.io events as the web app (`/api/auth/*`, `/api/chats/*`, `join_chat`, `send_message`, etc.)

## Relationship to the Web App

This app is a **separate client**, not a port — it talks to the exact same backend (`backend/` on Railway). Auth (email/password + Google Sign-In), chat history, and AI responses are all shared with the web experience; only the UI layer is native.

```
Oxywise.ai
├── frontend/                    → Web client (Next.js, Vercel)
├── backend/                     → Shared API (Express, Railway)
└── OxywiseApp/
    └── OxywisefrontendApp/      → Mobile client (Expo, this app)
```

## Getting Started

```bash
npm install
npx expo start
```

Scan the QR code with the **Expo Go** app on your phone (iOS or Android) to run it live during development.

### Environment variables

Create a `.env` (or use `app.config.js`/`eas.json` extra fields, per Expo convention) with:

```
EXPO_PUBLIC_API_URL=https://<railway-backend-domain>
EXPO_PUBLIC_SOCKET_URL=https://<railway-backend-domain>
EXPO_PUBLIC_GOOGLE_CLIENT_ID=<google client id>
```

For local backend testing, point these to your machine's local IP (not `localhost`) so a physical device running Expo Go can reach it, e.g. `http://192.168.x.x:5000`.

## Build Plan

Screens are being built one at a time rather than scaffolding everything up front:

- [ ] First screen (TBD — decide and build)
- [ ] Login / Signup
- [ ] Chatbot (AI assistant)
- [ ] Home / plant suggestions
- [ ] Profile

## Notes for Contributors / AI Agents

- This folder has its own `AGENTS.md` for mobile-specific working instructions.
- Do not duplicate backend logic here — this app only consumes the existing API and Socket.io events documented in the main project `README.md`.
- Keep brand tokens (colors, fonts) consistent with the web app: primary green `#4A7C1F`, ocean blue `#185FA5`, amber `#E8951F`, sage backgrounds `#EAF3DE`/`#F7F9F2`; Gelasio for headings, Poppins for body (use React Native-compatible font loading via `expo-font`).

## License

TBD
