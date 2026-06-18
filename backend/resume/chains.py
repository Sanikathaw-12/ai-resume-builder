from langchain_groq import ChatGroq
from langchain_core.prompts import PromptTemplate
from dotenv import load_dotenv

load_dotenv()

llm = ChatGroq(model="llama-3.3-70b-versatile", temperature=0.7)

def generate_project_bullets(name: str, stack: str, description: str) -> str:
    prompt = PromptTemplate(
        input_variables=["project_name", "tech_stack", "description"],
        template="""
You are an expert resume writer for software engineering students.

Generate exactly 3 professional resume bullet points for this project:

Project Name: {project_name}
Tech Stack: {tech_stack}
What it does: {description}

Rules:
- Start each bullet with a strong action verb
- Include specific tech stack mentions
- Keep each bullet under 20 words
- Make it ATS-friendly

Return only 3 bullets, nothing else. Format:
- bullet 1
- bullet 2
- bullet 3
"""
    )
    chain = prompt | llm
    result = chain.invoke({
        "project_name": name,
        "tech_stack": stack,
        "description": description
    })
    return result.content


def check_ats_score(resume_text: str, job_description: str) -> dict:
    prompt = PromptTemplate(
        input_variables=["resume", "jd"],
        template="""
You are an ATS (Applicant Tracking System) expert.

Compare this resume against the job description and give a detailed analysis.

Resume:
{resume}

Job Description:
{jd}

Return your response in this EXACT format and nothing else:
SCORE: (number out of 100)
MATCHED KEYWORDS: (comma separated list)
MISSING KEYWORDS: (comma separated list)
STRONG SECTIONS: (comma separated list)
WEAK SECTIONS: (comma separated list)
TOP 3 IMPROVEMENTS:
1. (improvement 1)
2. (improvement 2)
3. (improvement 3)
"""
    )
    chain = prompt | llm
    result = chain.invoke({
        "resume": resume_text,
        "jd": job_description
    })
    return result.content


def generate_cover_letter(resume_text: str, job_description: str, name: str, study_year: str) -> str:
    prompt = PromptTemplate(
        input_variables=["resume", "jd", "name", "study_year"],
        template="""
You are an expert cover letter writer for software engineering students in India.

Write a professional and personalized cover letter based on this resume and job description.

Candidate Name: {name}
Year of Study: {study_year}
Resume: {resume}
Job Description: {jd}

Rules:
- Keep it under 250 words
- The candidate is a {study_year} undergraduate student
- Sound genuine and enthusiastic, not robotic
- Mention 2-3 specific projects from the resume that match the JD
- Mention specific skills that match the job description
- End with a confident closing line
- Do NOT use generic phrases like "I am a hard worker" or "I am passionate"
- Format: Dear Hiring Manager, [body paragraphs], Sincerely, [name]

Write the cover letter now:
"""
    )
    chain = prompt | llm
    result = chain.invoke({
        "resume": resume_text,
        "jd": job_description,
        "name": name,
        "study_year": study_year
    })
    return result.content

def roast_resume(resume_text: str) -> str:
    prompt = PromptTemplate(
        input_variables=["resume"],
        template="""
You are a brutally honest but funny resume reviewer for software engineering students in India.

Roast this resume in a helpful but savage way. Be like a strict senior developer who has seen thousands of resumes.

Resume:
{resume}

Rules:
- Be funny but constructive — every roast should have a helpful tip
- Call out clichés, missing things, and weak sections specifically
- Mention specific details FROM the resume — don't be generic
- Use a conversational, punchy tone
- Structure your roast like this:

OVERALL VERDICT: (one savage but funny line about the resume)

🔥 ROAST POINTS:
1. (specific roast point 1 with helpful tip)
2. (specific roast point 2 with helpful tip)
3. (specific roast point 3 with helpful tip)
4. (specific roast point 4 with helpful tip)
5. (specific roast point 5 with helpful tip)

💪 WHAT'S ACTUALLY GOOD:
1. (genuine strength 1)
2. (genuine strength 2)
3. (genuine strength 3)

⚡ TOP 3 THINGS TO FIX RIGHT NOW:
1. (most important fix)
2. (second most important fix)
3. (third most important fix)

FINAL SCORE: (X/10) - (one last funny closing line)
"""
    )
    chain = prompt | llm
    result = chain.invoke({"resume": resume_text})
    return result.content


def generate_interview_questions(resume_text: str, job_description: str) -> str:
    prompt = PromptTemplate(
        input_variables=["resume", "jd"],
        template="""
You are an expert technical interviewer for software engineering and ML roles in India.

Generate a personalized interview preparation guide based on this candidate's resume and job description.

Resume:
{resume}

Job Description:
{jd}

Generate exactly in this format:

🧠 TECHNICAL QUESTIONS (from your projects):
1. (specific question about their actual project)
2. (specific question about their actual project)
3. (specific question about their actual project)
4. (specific question about their actual project)
5. (specific question about their actual project)

💻 CODING QUESTIONS (based on their stack):
1. (coding question related to their tech stack)
2. (coding question related to their tech stack)
3. (coding question related to their tech stack)

🤔 CONCEPTUAL QUESTIONS (ML/AI concepts):
1. (conceptual question based on JD)
2. (conceptual question based on JD)
3. (conceptual question based on JD)
4. (conceptual question based on JD)

🎯 HR QUESTIONS:
1. (HR question specific to their background)
2. (HR question specific to their background)
3. (HR question specific to their background)

⚡ MOST LIKELY ASKED QUESTION:
(the single most important question they should prepare for this specific role)

💡 QUICK TIPS FOR THIS INTERVIEW:
1. (specific tip based on their profile)
2. (specific tip based on their profile)
3. (specific tip based on their profile)
"""
    )
    chain = prompt | llm
    result = chain.invoke({
        "resume": resume_text,
        "jd": job_description
    })
    return result.content


def generate_linkedin_bio(resume_text: str, target_role: str) -> str:
    prompt = PromptTemplate(
        input_variables=["resume", "role"],
        template="""
You are an expert LinkedIn profile writer for software engineering students in India.

Generate a complete LinkedIn bio package based on this resume and target role.

Resume:
{resume}

Target Role: {role}

Generate exactly in this format:

🎯 LINKEDIN HEADLINE:
(A punchy headline under 120 characters. Format: Title | Skill1 • Skill2 • Skill3 | College Name)

📝 ABOUT SECTION:
(3-4 paragraph about section, 2000 characters max. Should include: who you are, what you build, your best projects, your skills, and what you're looking for. Sound human and genuine, not corporate.)

🔗 CONNECTION REQUEST MESSAGE:
(A short 300 character connection request to send to recruiters. Friendly and specific.)

📨 COLD DM TO RECRUITER:
(A short message to send to a recruiter on LinkedIn asking about internship opportunities. Under 500 characters. Mention 1 specific project.)

🏷️ TOP 5 SKILLS TO ADD ON LINKEDIN:
1. 
2. 
3. 
4. 
5. 
"""
    )
    chain = prompt | llm
    result = chain.invoke({
        "resume": resume_text,
        "role": target_role
    })
    return result.content