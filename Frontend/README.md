# iforai — Frontend

React.js + Tailwind CSS frontend with GSAP animations and 4-layer architecture.

---

## Tech Stack

- **Framework** — React.js (Vite)
- **Styling** — Tailwind CSS
- **Animations** — GSAP
- **Routing** — React Router v7
- **State** — Context API + Custom Hooks
- **HTTP** — Axios

---

## Getting Started

### 1. Install dependencies
```bash
npm install
```

### 2. Create `.env.local` file
```env
VITE_API_URL=http://localhost:3000
```

### 3. Run the app
```bash
npm run dev
```

---

## Folder Structure

```
Frontend/src/
├── features/
│   ├── auth/
│   │   ├── components/
│   │   │   └── protection.jsx      # Protected route wrapper
│   │   ├── hooks/
│   │   │   └── useAuth.js
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── Login.jsx
│   │   │   └── Register.jsx
│   │   ├── services/
│   │   │   └── auth.api.js
│   │   └── auth.context.jsx
│   │
│   └── interview/
│       ├── hooks/
│       │   └── useInterview.js
│       ├── pages/
│       │   ├── Dashboard.jsx
│       │   └── InterviewReport.jsx
│       ├── services/
│       │   └── interview.api.js
│       └── interview.context.jsx
│
├── App.jsx
├── app.routes.jsx
├── main.jsx
└── index.css
```

---

## Architecture — 4 Layers

```
UI Layer          →  Pages & Components
Context Layer     →  Global state (AuthProvider, InterviewProvider)
Hook Layer        →  useAuth, useInterview
API Layer         →  auth.api.js, interview.api.js (Axios)
```

---

## Environment Variables

| Variable | Description |
|----------|-------------|
| `VITE_API_URL` | Backend API URL |

---

## Color Theme

| Name | Hex |
|------|-----|
| Dark Forest Green | `#132B23` |
| Muted Green | `#5E775E` |
| Golden Olive | `#BA9B5F` |
| Beige | `#E9E0CF` |