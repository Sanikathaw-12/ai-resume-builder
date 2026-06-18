# AI Resume Builder

An AI-powered toolkit that helps engineering students prepare for internship and placement applications. Upload a resume and a job description once, then generate tailored bullet points, an ATS match score, a cover letter, interview prep questions, a LinkedIn profile package, and even a brutally honest "roast" of your resume — all powered by LLaMA 3.1 through Groq.

## Features

**PDF resume parser** — Upload your resume and the app extracts the full text automatically using PyMuPDF.

**Bullet generator** — Give it a project name, tech stack, and a one-line description, and get back three ATS-friendly resume bullet points written with strong action verbs.

**ATS score checker** — Compares your resume against a job description and returns a match score out of 100, matched and missing keywords, strong and weak sections, and the top improvements to make.

**Cover letter generator** — Generates a personalized, ready-to-send cover letter based on your resume, the job description, your name, and your year of study.

**Resume roaster** — Brutally honest, often funny AI feedback on your resume, structured as an overall verdict, specific roast points with fixes, genuine strengths, and a final score.

**Interview prep generator** — Produces a full prep guide with technical questions about your own projects, coding questions for your tech stack, conceptual ML/AI questions, HR questions, and quick tips — all personalized to your resume and the target role.

**LinkedIn profile generator** — Creates a complete LinkedIn package: headline, about section, a connection request message, a cold DM to recruiters, and a list of skills to add.

## Tech stack

| Layer | Technology |
|---|---|
| Frontend | React.js |
| Backend | FastAPI (Python) |
| LLM | Groq API — `llama-3.1-8b-instant` |
| LLM orchestration | LangChain (`PromptTemplate`, `ChatGroq`) |
| PDF parsing | PyMuPDF (`fitz`) |
| File uploads | `python-multipart` |
| Environment config | `python-dotenv` |

## Project structure


## Setup

### 1. Clone the repo

```bash
git clone https://github.com/Sanikathaw-12/ai-resume-builder.git
cd ai-resume-builder
```

### 2. Backend setup

```bash
cd backend/resume
python -m venv venv
venv\Scripts\activate          # Windows
pip install -r requirements.txt
```

Create a `.env` file in this folder with your Groq API key:your_key_here

Get a free key at [console.groq.com](https://console.groq.com).

Run the backend:

```bash
uvicorn mains:app --reload
```

The API will run at `http://127.0.0.1:8000`. Interactive docs are available at `http://127.0.0.1:8000/docs`.

### 3. Frontend setup

In a new terminal:

```bash
cd frontend
npm install
npm start
```

The app will open at `http://localhost:3000`.

## How it works

1. Upload your resume PDF — the backend parses it with PyMuPDF.
2. Paste the job description you're targeting.
3. Choose any of the six tools above. Each one sends the parsed resume text and job description to a dedicated FastAPI endpoint, which builds a prompt with LangChain and sends it to Groq's `llama-3.1-8b-instant` model.
4. The AI-generated result is displayed in the UI and can be copied with one click.

## Known limitations

- The PDF parser is optimized for single-column resume layouts. Multi-column or heavily templated resumes may not extract in the correct reading order.
- AI-generated scores (ATS score, roast score) reflect the model's judgment rather than a fixed formula, and may vary slightly between runs.
- The Groq free tier is rate-limited to 15 requests per minute.

## Future improvements

- Resume version history with MySQL
- Multi-format export (PDF, DOCX)
- Two-column resume parsing support
- Deployment on Render (backend) and Vercel (frontend)

## Author

**Sanika Thawkar**
Electronics and Telecommunication Engineering, Pune Institute of Computer Technology
[GitHub](https://github.com/Sanikathaw-12)