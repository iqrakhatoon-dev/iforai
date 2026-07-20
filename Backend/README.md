# iforai — Backend

Node.js + Express.js REST API with JWT Authentication and Google Gemini AI Integration.

---

## Tech Stack

- **Runtime** — Node.js
- **Framework** — Express.js
- **Database** — MongoDB + Mongoose
- **Auth** — JWT, bcrypt, httpOnly Cookies, Token Blacklisting
- **AI** — Google Gemini API (@google/genai)
- **PDF** — Puppeteer
- **File Upload** — Multer (memory storage) + pdf-parse

---

## Getting Started

### 1. Install dependencies
```bash
npm install
```

### 2. Create `.env` file
```bash
cp .env.example .env
```

Fill in the values:
```env
PORT=3000
MONGO_URI=your_mongodb_atlas_uri
JWT_SECRET=your_jwt_secret
GOOGLE_GENAI_API_KEY=your_gemini_api_key
FRONTEND_URL=http://localhost:5173
```

### 3. Run the server
```bash
# Development
npm run dev

# Production
npm start
```

---

## API Routes

### Auth Routes — `/api/auth`

| Method | Route | Description | Access |
|--------|-------|-------------|--------|
| POST | `/register` | Register new user | Public |
| POST | `/login` | Login user | Public |
| POST | `/logout` | Logout user | Private |
| GET | `/me` | Get logged in user | Private |

### Interview Routes — `/api/interview`

| Method | Route | Description | Access |
|--------|-------|-------------|--------|
| POST | `/dashboard` | Generate AI interview report | Private |
| GET | `/dashboard` | Get all reports of user | Private |
| GET | `/dashboard/report/:id` | Get report by ID | Private |
| GET | `/dashboard/report/:id/download` | Download ATS resume PDF | Private |

---

## Folder Structure

```
Backend/
├── src/
│   ├── config/
│   │   └── db.js               # MongoDB connection
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   └── interview.controller.js
│   ├── middlewares/
│   │   ├── auth.middleware.js
│   │   └── file.middleware.js
│   ├── models/
│   │   ├── user.model.js
│   │   ├── blacklistToken.model.js
│   │   └── interviewReport.model.js
│   ├── routes/
│   │   ├── auth.routes.js
│   │   └── interview.routes.js
│   ├── services/
│   │   └── ai.service.js       # Gemini API integration
│   └── app.js
├── server.js
├── .env.example
└── package.json
```

---

## Environment Variables

| Variable | Description |
|----------|-------------|
| `PORT` | Server port (default: 3000) |
| `MONGO_URI` | MongoDB Atlas connection string |
| `JWT_SECRET` | Secret key for JWT signing |
| `GOOGLE_GENAI_API_KEY` | Google Gemini API key |
| `FRONTEND_URL` | Frontend URL for CORS |