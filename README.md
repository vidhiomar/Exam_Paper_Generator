# AI Exam Generator

<div align="center">
  <img src="./assets/readme/hero.png" alt="AI Exam Generator banner" width="100%" />
</div>

<div align="center">

  [![Typing SVG](https://readme-typing-svg.demolab.com?font=Sora&weight=700&size=24&duration=2800&pause=800&color=2563EB&center=true&vCenter=true&width=900&lines=Upload+Past+Papers;Extract+Blueprints+with+AI;Generate+Predicted+Question+Papers)](https://git.io/typing-svg)

  ![Next.js](https://img.shields.io/badge/Frontend-Next.js_14-0f172a?style=for-the-badge&logo=next.js&logoColor=white)
  ![FastAPI](https://img.shields.io/badge/Backend-FastAPI-0f766e?style=for-the-badge&logo=fastapi&logoColor=white)
  ![TypeScript](https://img.shields.io/badge/TypeScript-Strict-1d4ed8?style=for-the-badge&logo=typescript&logoColor=white)
  ![Groq](https://img.shields.io/badge/AI-Groq-f97316?style=for-the-badge)
  ![Tailwind CSS](https://img.shields.io/badge/UI-Tailwind_CSS-0891b2?style=for-the-badge&logo=tailwindcss&logoColor=white)

</div>

<p align="center">
  AI Exam Generator turns old question papers into structured blueprints, visual insights, and AI-generated predicted papers that stay aligned with the uploaded exam pattern.
</p>

---

## Why this project stands out

This project is built for students and educators who want more than OCR and more than a generic prompt box. The app analyzes a real question paper, extracts section-wise structure, visualizes the pattern on a dashboard, and generates a new paper based on the same blueprint.

### What it does

- Uploads previous exam papers from the frontend and sends them to a FastAPI backend
- Extracts text from PDFs and builds a blueprint of sections, questions, and marks
- Shows analytics on the dashboard with cards, tables, and charts
- Generates a predicted paper section by section using Groq
- Preserves the uploaded paper context instead of generating random unrelated questions

---

## Visual Overview

<div align="center">
  <img src="./assets/readme/pipeline.svg" alt="AI Exam Generator pipeline" width="100%" />
</div>

### Experience flow

```mermaid
flowchart LR
    A[Upload Question Paper] --> B[PDF Text Extraction]
    B --> C[Blueprint Parsing]
    C --> D[Dashboard Insights]
    D --> E[AI Section-wise Generation]
    E --> F[Predicted Question Paper]

    subgraph Frontend
      A
      D
      F
    end

    subgraph Backend
      B
      C
      E
    end
```

---

## Feature Highlights

| Feature | What it delivers |
| --- | --- |
| Smart upload flow | Accepts exam papers and pushes them through backend extraction |
| Blueprint analysis | Breaks papers into sections, question counts, marks, and structure |
| Visual dashboard | Displays key insights, blueprint rows, and charts in a polished UI |
| AI paper generation | Produces section-wise predicted questions from the uploaded context |
| Clean API contract | Frontend stores parsed blueprint JSON and generated paper data |
| Extensible architecture | Easy to improve extraction, prompts, charts, and export features |

---

## Demo Moments

These sections are designed to feel lively on GitHub using animated SVG plus bold graphics.

<div align="center">
  <img src="https://readme-typing-svg.demolab.com?font=DM+Sans&weight=700&size=18&duration=2400&pause=1000&color=F97316&center=true&vCenter=true&width=900&lines=Upload+%E2%86%92+Analyze+%E2%86%92+Visualize+%E2%86%92+Generate;Built+for+beautiful+exam+intelligence+workflows" alt="animated headline" />
</div>

### Suggested GIF slots

If you want to make the README even more premium later, add screen-recording GIFs here:

- `assets/readme/upload-demo.gif` for the upload and analysis flow
- `assets/readme/dashboard-demo.gif` for the insights and chart interactions
- `assets/readme/generation-demo.gif` for predicted paper generation

You can then embed them with:

```md
![Upload Demo](./assets/readme/upload-demo.gif)
![Dashboard Demo](./assets/readme/dashboard-demo.gif)
![Generation Demo](./assets/readme/generation-demo.gif)
```

---

## Tech Stack

### Frontend

- Next.js 14
- React 18
- TypeScript
- Tailwind CSS
- Framer Motion
- Recharts
- Lucide React
- Sonner

### Backend

- FastAPI
- Uvicorn
- pdfplumber
- python-multipart
- Groq API
- Regex-based blueprint extraction

---

## Project Structure

```text
AI-exam-generator/
|-- client/
|   |-- app/
|   |   |-- page.tsx
|   |   |-- dashboard/page.tsx
|   |   `-- paper/page.tsx
|   |-- components/
|   `-- lib/
|-- server/
|   |-- app/
|   |   |-- routes/
|   |   `-- services/
|   `-- uploads/
`-- assets/
    `-- readme/
```

---

## Local Setup

### 1. Clone the project

```bash
git clone <your-repo-url>
cd AI-exam-generator
```

### 2. Start the frontend

```bash
cd client
npm install
npm run dev
```

Frontend runs on `http://localhost:3000`

### 3. Start the backend

```bash
cd server
pip install -r requirements.txt
uvicorn app.main:app --reload
```

Backend runs on `http://127.0.0.1:8000`

### 4. Environment variables

Create or update `server/.env`:

```env
GROQ_API_KEY=your_groq_api_key
GROQ_MODEL=llama-3.1-8b-instant
```

Optional frontend override in `client/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000
```

---

## API Flow

### Upload route

- `POST /upload/`
- Saves the file
- Extracts PDF text
- Parses blueprint JSON
- Returns preview plus blueprint data

### Generate route

- `POST /generate/`
- Accepts blueprint JSON
- Generates section-wise questions
- Returns `generated_paper`

---

## Current Workflow

1. User uploads a previous exam paper
2. Backend extracts and parses section/question data
3. Frontend stores the blueprint in local storage
4. Dashboard renders insights from the extracted JSON
5. User clicks generate
6. Backend generates a predicted paper using the uploaded paper as context
7. Frontend shows the generated result on the paper page

---

## Design Notes

- The UI uses animated onboarding, rich gradients, and a modern dashboard layout
- The README mirrors that same vibe with SVG graphics, animated headers, and flow visuals
- The architecture is intentionally split so extraction, analysis, and generation can evolve independently

---

## Future Improvements

- Add OCR fallback for scanned image-based papers
- Add PDF export for generated papers
- Improve blueprint extraction for complex university formats
- Add subject detection and metadata tags
- Store paper history in a database
- Add authentication and multi-user dashboards

---

## Built For

This project is a strong base for:

- Student productivity tools
- EdTech hackathons
- AI document intelligence demos
- Academic automation products
- Portfolio projects with real frontend plus backend integration

---

## Credits

Built with Next.js, FastAPI, Groq, Tailwind CSS, Framer Motion, and a lot of curiosity about how exam patterns can be turned into usable intelligence.
