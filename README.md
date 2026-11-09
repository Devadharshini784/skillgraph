# SkillGraph 🗺️

> Know exactly what to learn to get hired.

SkillGraph analyzes real job descriptions, identifies your skill gaps through a personalized quiz, and generates a week-by-week learning roadmap — all for free.

🔗 **Live Demo:** https://skillgraph-neon.vercel.app

---

## Features

- 🔍 **Role-based skill extraction** — Analyzes real job market data for 6+ roles
- 📊 **Skill gap quiz** — 10-question assessment with weighted readiness scoring
- 🗺️ **12-week roadmap** — Auto-generated learning plan with free resource links
- 📈 **Progress tracking** — Mark weeks complete, track your journey from dashboard
- 🔐 **Auth system** — Secure register/login with JWT and bcrypt password hashing
- ☁️ **Cloud deployed** — Live on Vercel + Render + Supabase

---

## Tech Stack

**Frontend**
- React + Vite
- React Router DOM
- Axios

**Backend**
- Node.js + Express
- JWT Authentication
- Bcrypt password hashing
- Cheerio (web scraping)

**Database**
- PostgreSQL (Supabase)

**Deployment**
- Frontend → Vercel
- Backend → Render
- Database → Supabase

---

## Database Schema

```sql
users         — id, name, email, password_hash, target_role, created_at
skills        — id, name, category, frequency_score, last_updated
user_skills   — user_id, skill_id, status, confidence, updated_at
roadmap_weeks — user_id, week_no, skill_id, resource_url, completed
```

---

## Getting Started Locally

### Prerequisites
- Node.js v18+
- PostgreSQL database (or Supabase account)

### Clone the repo
```bash
git clone https://github.com/Devadharshini784/skillgraph.git
cd skillgraph
```

### Setup Backend
```bash
cd server
npm install
```

Create `server/.env`:
```
PORT=5000
DATABASE_URL=your_postgresql_connection_string
JWT_SECRET=your_jwt_secret
```

```bash
npx nodemon index.js
```

### Setup Frontend
```bash
cd client
npm install
npm run dev
```

Visit `http://localhost:5173`

---

## Supported Roles

| Role | Skills Covered |
|------|----------------|
| Backend Engineer | Node.js, Python, PostgreSQL, Docker, AWS, Redis |
| Frontend Developer | React, TypeScript, CSS, Next.js, Tailwind, Figma |
| Full Stack Developer | React, Node.js, PostgreSQL, Docker, TypeScript |
| Data Scientist | Python, ML, Deep Learning, NLP, Data Analysis |
| DevOps Engineer | Docker, Kubernetes, AWS, Linux, CI/CD, Terraform |
| ML Engineer | Python, TensorFlow, Deep Learning, NLP, Docker |

---

## Project Structure

```
skillgraph/
├── client/                 # React frontend
│   ├── src/
│   │   ├── pages/         # Landing, Dashboard, Quiz, Roadmap
│   │   ├── context/       # Auth context
│   │   └── utils/         # API config
├── server/                 # Node.js backend
│   ├── controllers/       # Auth, Skills, Quiz, Roadmap
│   ├── routes/            # API routes
│   ├── middleware/        # JWT auth middleware
│   └── data/              # Skills dictionary, resources
```

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Create account |
| POST | `/api/auth/login` | Login |
| GET | `/api/skills/extract?role=` | Extract skills for role |
| POST | `/api/skills/quiz` | Submit quiz answers |
| POST | `/api/roadmap/generate` | Generate roadmap |
| GET | `/api/roadmap` | Get saved roadmap |
| PATCH | `/api/roadmap/complete/:weekNo` | Mark week complete |

---

## How It Works

1. **Enter your target role** — Backend Engineer, Frontend Developer, Data Scientist, and more
2. **We analyze the job market** — SkillGraph scans real job postings and ranks the most in-demand skills
3. **Take the skill gap quiz** — Rate your confidence in each skill. We calculate your readiness score instantly
4. **Follow your roadmap** — Get a 12-week plan with free learning resources. Track your progress week by week

---

## Built By

**Devadharshini** 

> Built with React, Node.js, PostgreSQL and a lot of determination 💪

---

⭐ Star this repo if you found it useful!
