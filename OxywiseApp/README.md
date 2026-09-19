# Oxywise App

Oxywise is an AI-powered plant companion that helps people discover plants suited to where they live. The product combines weather-aware plant matching, plant-care guidance, and an AI assistant across a web experience and a mobile app.

This directory contains the mobile Expo application and the mobile backend placeholder. The web client and the primary Node.js backend live at the repository root and are part of the same product.

## Product Experience

- Plant recommendations informed by local weather and growing conditions
- AI-assisted plant and care guidance
- A live-weather badge and location-aware matching flow
- Authenticated chat on the web client
- Responsive web experience and native Android/iOS experience
- Shared visual direction based on greenery, calm surfaces, and practical plant data

## Repository Layout

```text
oxywise.Ai/
├── backend/                         # Primary Node.js/Express API
├── frontend/                        # Next.js web client
└── OxywiseApp/
    ├── OxywisebackendApp/           # Mobile backend workspace placeholder
    ├── OxywisefrontendApp/          # Expo Router mobile client
    │   ├── app/                     # File-based routes and screens
    │   ├── components/front/        # Home, weather, feature, and footer sections
    │   ├── components/ui/           # Reusable interface components
    │   ├── constants/               # Theme constants
    │   ├── hooks/                   # Color-scheme and theme hooks
    │   └── Theme/                   # Shared mobile design tokens
    └── README.md
```

## Clients

### Web

The web client is built with Next.js, React, and TypeScript. It provides the public landing experience, authentication pages, and an authenticated chatbot flow.

```text
frontend/
├── app/             # Next.js routes
├── app-routes/      # Web route composition
├── components/      # Auth, layout, and shared components
├── lib/             # API helpers
├── store/           # Zustand state
└── views/           # Page-level UI and chat views
```

Run the web client:

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:3000` after the development server starts.

Useful web scripts:

```bash
npm run dev
npm run build
npm run start
npm run lint
```

### Mobile

The mobile client uses Expo 54, React Native, Expo Router, and TypeScript. It supports Android, iOS, and an Expo web target from the same codebase.

The current mobile home experience includes a plant-focused hero, a weather badge, feature sections, a how-it-works section, and a `Find my plants` action. Routes are file-based under `OxywisefrontendApp/app`.

Run the mobile client:

```bash
cd OxywiseApp/OxywisefrontendApp
npm install
npx expo start
```

From the Expo developer menu, open the project in Expo Go, an Android emulator, or an iOS simulator. The mobile web target can be started with:

```bash
npm run web
```

Useful mobile scripts:

```bash
npm run start
npm run android
npm run ios
npm run web
npm run lint
```

## Backend

The primary API is in [`backend/`](../backend). It uses Node.js, Express, MongoDB/Mongoose, JWT authentication, Google OAuth support, Socket.IO, weather services, and AI-backed plant/chat services.

Start it from the repository root:

```bash
cd backend
npm install
npm run dev
```

The API is expected at `http://localhost:5000` during local development. Configure the backend environment variables in `backend/.env` according to [`backend/README.md`](../backend/README.md).

`OxywiseApp/OxywisebackendApp` is currently only a package workspace. It does not yet contain a separate mobile API implementation, so the mobile client should use the shared root backend while that layer is being developed.

## Technology Stack

| Area | Technology |
| --- | --- |
| Web | Next.js, React, TypeScript, Tailwind CSS |
| Mobile | Expo 54, React Native, Expo Router, TypeScript |
| UI and motion | Styled Components, Framer Motion, React Native Reanimated |
| 3D web experience | Three.js, React Three Fiber, Drei |
| State and networking | Zustand, Socket.IO client |
| Backend | Node.js, Express, MongoDB, Mongoose |
| AI and services | Groq/OpenAI-compatible service, embeddings, weather integration |
| Authentication | JWT and Google OAuth |

## Development Notes

- Keep web-specific UI in `frontend/` and native UI in `OxywiseApp/OxywisefrontendApp/`.
- Reuse product terminology and plant-matching behavior across both clients.
- Treat the root `backend/` as the current source of API behavior until the mobile backend workspace is implemented.
- Expo-specific changes should follow the Expo 54 documentation and the local guidance in [`OxywisefrontendApp/AGENTS.md`](OxywisefrontendApp/AGENTS.md).

## Project Status

Oxywise is under active development. The web client has the broader authentication and chatbot flow, while the mobile client establishes the native product shell and plant-matching home experience. The mobile chatbot route and dedicated mobile backend are still being expanded.

## License

No final public license has been declared yet.