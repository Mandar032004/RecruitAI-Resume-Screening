# 🤖 RecruitAI — AI Resume Screening Platform

A full-stack, production-grade resume screening platform with AI-powered ATS scoring,
skill gap analysis, and a recruiter dashboard.

---

## 📁 Project Structure

```
resume-screener/
│
├── README.md                          ← You are here
│
├── backend/                           ← Node.js + Express API (Port 3001)
│   ├── .env                           ← Environment variables (PORT=3001)
│   ├── package.json                   ← Backend dependencies
│   └── src/
│       ├── index.js                   ← Express server entry point
│       ├── routes/
│       │   └── analyzeRoutes.js       ← All API endpoints
│       ├── services/
│       │   ├── resumeParser.js        ← PDF/DOCX text extraction + NLP parsing
│       │   └── aiEngine.js            ← ATS scoring + AI insights engine
│       └── data/
│           ├── skillsDb.js            ← 500+ skills taxonomy database
│           └── candidateStore.js      ← In-memory candidate store (JSON backed)
│
└── frontend/                          ← React 18 + Vite + Tailwind (Port 5173)
    ├── index.html                     ← HTML entry point
    ├── vite.config.js                 ← Vite + API proxy config
    ├── tailwind.config.js             ← Design tokens & animations
    ├── postcss.config.js              ← PostCSS config
    ├── package.json                   ← Frontend dependencies
    └── src/
        ├── main.jsx                   ← React DOM root
        ├── App.jsx                    ← Router + ThemeProvider
        ├── index.css                  ← Global styles, design system, dark mode
        │
        ├── context/
        │   └── ThemeContext.jsx       ← Dark/Light mode toggle (localStorage)
        │
        ├── components/
        │   └── Navbar.jsx             ← Fixed glassmorphism navbar + hamburger menu
        │
        └── pages/
            ├── LandingPage.jsx        ← Hero animation, features, stats, CTA
            ├── UploadPage.jsx         ← Drag & drop upload + JD input + AI progress
            ├── ResultsPage.jsx        ← ATS score gauge, skill bars, AI insights
            └── DashboardPage.jsx      ← Candidate table, filters, search, side panel
```

---

## 🚀 Running the App

### Start Backend (Terminal 1)
```powershell
cd resume-screener\backend
node src/index.js
# → Running at http://localhost:3001
```

### Start Frontend (Terminal 2)
```powershell
cd resume-screener\frontend
npx vite --port 5173
# → Running at http://localhost:5173
```

Then open **http://localhost:5173** in your browser.

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check |
| POST | `/api/analyze` | Upload resume + JD → AI analysis |
| GET | `/api/candidates` | List all candidates |
| GET | `/api/candidates/:id` | Get single candidate |
| PUT | `/api/candidates/:id/status` | Update status (shortlisted/rejected/on_hold) |
| DELETE | `/api/candidates` | Clear all candidates |

---

## 🧠 AI Scoring Weights

| Factor | Weight | Method |
|--------|--------|--------|
| Skills Match | 35% | Set intersection + partial match |
| Experience | 25% | Year extraction vs. requirement |
| Education | 15% | Degree level hierarchy |
| Keywords | 15% | JD keyword density |
| Semantic | 10% | TF-IDF cosine similarity |

---

## 📦 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite 5, Tailwind CSS 3, Framer Motion |
| Backend | Node.js, Express, Multer |
| AI/NLP | natural (TF-IDF), pdf-parse, mammoth |
| State | React Context, React Router v6 |
| Icons | Lucide React |
