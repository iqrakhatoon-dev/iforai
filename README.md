# iforai — AI-Powered Interview Preparation Tool

> Upload your resume. Paste a job description. Let AI do the rest.

[![Live Demo](https://img.shields.io/badge/Live-Demo-BA9B5F?style=for-the-badge)](https://iforai.vercel.app)
[![GitHub](https://img.shields.io/badge/GitHub-iqrakhatoon--dev-132B23?style=for-the-badge&logo=github)](https://github.com/iqrakhatoon-dev/iforai)

---

## What is iforai?

iforai is a full-stack AI-powered interview preparation tool. A user uploads their resume and pastes a job description — the AI analyzes both and generates:

- **Match Score** — how well your profile fits the role
- **Technical Questions** — 5 targeted questions based on the JD
- **Behavioral Questions** — 3 role-specific behavioral questions
- **Skill Gaps** — what's missing and how critical it is
- **5-Day Preparation Plan** — day-by-day focus areas
- **ATS-Optimized Resume PDF** — downloadable, recruiter-ready resume

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React.js, Tailwind CSS, GSAP, React Router |
| Backend | Node.js, Express.js |
| Database | MongoDB, Mongoose |
| AI | Google Gemini API |
| PDF | Puppeteer |
| Auth | JWT, bcrypt, httpOnly Cookies, Token Blacklisting |
| File Upload | Multer, pdf-parse |
| Deployment | Vercel (Frontend), Render (Backend), MongoDB Atlas |

---

## Project Structure

```
iforai/
├── Backend/          # Node.js + Express.js REST API
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middlewares/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   └── app.js
│   ├── .env.example
│   └── package.json
│
├── Frontend/         # React.js + Tailwind CSS
│   ├── src/
│   │   ├── features/
│   │   │   ├── auth/
│   │   │   └── interview/
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
│
└── README.md
```

---

## How to Run Locally

### Prerequisites
- Node.js v18+
- MongoDB Atlas account
- Google Gemini API key

### 1. Clone the repo
```bash
git clone https://github.com/iqrakhatoon-dev/iforai.git
cd iforai
```

### 2. Backend setup
```bash
cd Backend
npm install
cp .env.example .env
# Fill in your .env values
npm run dev
```

### 3. Frontend setup
```bash
cd Frontend
npm install
cp .env.example .env.local
# Add VITE_API_URL=http://localhost:3000
npm run dev
```

---

## Screenshots

> Coming soon

---

## Credits

- Project idea & initial structure inspired by **Ankur Sir — Sheryians Coding School**
- Design system, theme & debugging assistance — **Claude AI (Anthropic)**
- Built & customized by **Iqra Khatoon**

---

## License

MIT License — feel free to use and modify.

---

<p align="center">Built by <a href="https://iqrakhatoon.vercel.app">Iqra Khatoon</a> · <a href="https://instagram.com/iqrakhatoon.dev">@iqrakhatoon.dev</a></p>