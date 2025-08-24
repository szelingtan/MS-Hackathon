# ReachTogether 🌱

**ReachTogether** is a gamified donation and impact-tracking platform for Hong Kong. Users support real-world community projects, earn water droplets, and grow a personalized virtual garden. The app visualizes impact stories, project milestones, and fosters community engagement.

---

## Features

- 🌏 **Interactive Hong Kong Map:** Explore districts, view impact stories, and discover donation projects.
- 💧 **Virtual Plant Game:** Earn water drops for donations, customize your garden, and share with friends.
- 🏫 **Project Milestones:** Track progress and see real-world updates for each supported project.
- 🏅 **Profile & Achievements:** View your impact summary, badges, and messages of appreciation.
- 📈 **Leaderboard & Community:** See top donors and community gardens.
- 📝 **Create & Edit Posts:** Share your impact stories and updates with the community.

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (or [Bun](https://bun.sh/))
- [npm](https://www.npmjs.com/) or [bun](https://bun.sh/)

### Installation

```sh
bun install
bun dev
```
_or with npm:_
```sh
npm install
npm run dev
```

### Map Prototype

Prototype with `maplibre` map + [HK districts data](https://data.gov.hk/en-data/dataset/hk-had-json1-hong-kong-administrative-boundaries/resource/706ed666-8f6c-4869-8c18-b74f863a5d22) from data.gov.hk

```sh
cd hk-game
npx serve
```

---

## Project Structure

```
├── src/
│   ├── components/         # UI components (Map, PlantGame, Profile, etc.)
│   ├── pages/              # App pages (Landing, Dashboard, Profile, ProjectDetails)
│   ├── data/               # Static data (background themes, etc.)
│   ├── hooks/              # Custom React hooks
│   ├── services/           # Backend service logic
│   ├── types/              # TypeScript types
│   └── assets/             # Images and icons
├── public/                 # Static files (favicon, robots.txt, etc.)
├── hk-game/                # Map prototype and data
├── index.html              # Main app entry
└── README.md               # Project info
```

---

## Data Sources

- [HK Administrative Boundaries](https://data.gov.hk/en-data/dataset/hk-had-json1-hong-kong-administrative-boundaries/resource/706ed666-8f6c-4869-8c18-b74f863a5d22)
- Project and milestone data in `/hk-game/data/`

---

## License

MIT

---
