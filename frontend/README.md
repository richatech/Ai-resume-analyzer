# AI Resume Analyzer

Full-stack sample project (React frontend + Express backend) that analyzes resume text using the OpenAI Chat API.

## Setup

### Backend
1. `cd backend`
2. `cp .env.example .env` and set `OPENAI_API_KEY`
3. `npm install`
4. `npm run dev` (or `npm start`)

### Frontend
1. `cd frontend`
2. `npm install`
3. `npm run dev`
4. Open http://localhost:5173

Notes:
- Backend uses OpenAI Chat Completions API. Make sure to set `OPENAI_API_KEY` in backend/.env.
- For demo without API, you can mock responses in backend/index.js.
