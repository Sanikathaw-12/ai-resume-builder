from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from parser import parse_resume
from chains import generate_project_bullets, check_ats_score, generate_cover_letter, roast_resume, generate_interview_questions, generate_linkedin_bio
import tempfile, os

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"message": "Resume Builder API is running!"}

@app.post("/parse-resume")
async def upload_resume(file: UploadFile = File(...)):
    with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as tmp:
        tmp.write(await file.read())
        tmp_path = tmp.name
    text = parse_resume(tmp_path)
    os.unlink(tmp_path)
    return {"resume_text": text}

@app.post("/generate-bullets")
async def generate_bullets(data: dict):
    bullets = generate_project_bullets(
        name=data["project_name"],
        stack=data["tech_stack"],
        description=data["description"]
    )
    return {"bullets": bullets}

@app.post("/ats-score")
async def ats_score(data: dict):
    score = check_ats_score(
        resume_text=data["resume_text"],
        job_description=data["job_description"]
    )
    return {"result": score}

@app.post("/cover-letter")
async def cover_letter(data: dict):
    letter = generate_cover_letter(
        resume_text=data["resume_text"],
        job_description=data["job_description"],
        name=data["name"],
        study_year=data["study_year"]
    )
    return {"cover_letter": letter}

@app.post("/roast-resume")
async def roast(data: dict):
    result = roast_resume(resume_text=data["resume_text"])
    return {"roast": result}

@app.post("/interview-prep")
async def interview_prep(data: dict):
    result = generate_interview_questions(
        resume_text=data["resume_text"],
        job_description=data["job_description"]
    )
    return {"questions": result}

@app.post("/linkedin-bio")
async def linkedin_bio(data: dict):
    result = generate_linkedin_bio(
        resume_text=data["resume_text"],
        target_role=data["target_role"]
    )
    return {"bio": result}