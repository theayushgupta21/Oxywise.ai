# 🌿 Oxywise.ai

> Smart, AI-powered plant and greenery suggestions to make your home greener — personalized by weather, location, and atmosphere.

## About

Oxywise.ai helps users turn their homes into green, breathable spaces. Using AI, it recommends the right seeds, plants, and flower pots based on the user's **location**, **weather conditions**, and **local atmosphere/climate**, and guides them on how to care for their plants  helping reduce CO2 and improve air quality at home.

## Problem

Most people want to add greenery to their homes but don't know:
- Which plants suit their local climate and weather
- How much sunlight, water, or care a plant actually needs
- What to gift someone for a plant-based occasion (birthday, housewarming, etc.)

Oxywise.ai solves this with smart, personalized, AI-driven suggestions.

## Core Features (Phase 1)

- 🌱 **Plant & seed suggestions** — recommendations based on location, weather, and atmosphere
- 💧 **Care schedule** — daily / occasional / alternate-day care reminders per plant
- 📍 **Location-based recommendations** — climate-aware suggestions for the user's region
- 🌤️ **Weather-based guidance** — adjusts care tips dynamically as weather changes

## Planned Features (Future Phases)

- 🌍 CO2 / oxygen impact tracker  show how much a user's plants are helping the environment
- 🔔 Push notification reminders for watering, fertilizing, repotting
- 📷 AI-based plant health diagnosis from photos
- 🏡 Space-based suggestions (balcony, indoor, terrace, small apartment)
- 🎁 Occasion-based plant/flower gifting suggestions
- 👥 Community sharing  users showcase their "green home journey"

## Brand Theme

| Color | Hex | Purpose |
|---|---|---|
| Primary Green | `#639922` | Growth, care, accomplishment |
| Ocean Blue | `#185FA5` | Trust, weather-based features |
| Warm Amber | `#EF9F27` | Streaks, rewards, milestones |
| Sage Base | `#EAF3DE` | Background, calm daily-use feel |

## Tech Stack

- **Frontend**: Next.js (App Router) + React + TypeScript
- **Styling**: Tailwind CSS
- **Animation**: Framer Motion
- **Icons**: lucide-react
- **Fonts**: Gelasio (display/heading), via `next/font/google`
- **Backend**: TBD
- **AI/ML**: TBD
- **Database**: TBD

## Brand Theme

| Color | Tailwind / Hex | Purpose |
|---|---|---|
| Primary Green | `green-700` · `#639922` | Growth, care, accomplishment |
| Ocean Blue | `#185FA5` | Trust, weather-based features |
| Warm Amber | `#EF9F27` | Streaks, rewards, milestones |
| Sage / Green-50 Base | `#EAF3DE` | Background, calm daily-use feel |

## Project Structure (Frontend)

```
frontend/
├── app-routes/
│   └── Approutes.tsx
├── components/
│   └── layouts/
│       ├── Navbar.tsx
│       ├── Footer.tsx
├── Oxywisestartbox.tsx
├── views/
│   ├── Chatbot.tsx  
│   ├── Home.tsx
│   ├── Herosection.tsx
│   ├── Threestepsuses.tsx      # "how it works" — 3 step process
│   ├── Features.tsx             # feature grid
│   ├── Cards.tsx
├── chat/
    ├── ChatWindow.tsx
    ├── InputBar.tsx
    ├── Sidebar.tsx
├── app/
    ├── layout.tsx
    ├── page.tsx
    ├── globals.css
└── chatbot/
    ├──page.tsx
├──store/
    └── useChatStore.ts  


 
```

## Landing Page — Sections Built So Far

- ✅ **Navbar** — logo, nav links, login/sign up
- ✅ **Hero section** — headline, live weather-sync badge, CTA, animated plant-match visual
- ✅ **How it works** — 3-step process (location → weather match → care plan), horizontal layout with scroll on mobile
- ✅ **Features** — smart suggestions, weather-synced care, CO2 tracker, occasion gifting
- ✅ **CTA band** — "Your home is one plant away from greener air"
- ✅ **Footer** — logo + copyright, tagline

## Getting Started

```bash
cd frontend
npm install
npm run dev
```

App runs at `http://localhost:3000` by default.

> ⚠️ If you see a "slow filesystem" warning in dev mode, make sure the project lives on a local drive (not a network drive or a cloud-synced folder like OneDrive/Google Drive).

## Status

🚧 In development  landing page frontend (hero, how-it-works, features, CTA, footer) is built. Backend, AI logic, and auth are not started yet.

## License

TBD