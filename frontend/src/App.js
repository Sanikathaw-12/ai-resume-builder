import { useState } from "react";

const theme = {
  bg: "#2A2420",
  paper: "#F8F2E4",
  ink: "#2A2420",
  cream: "#F8F2E4",
  muted: "#9C9184",
  line: "rgba(42,36,32,0.14)",
  lineLight: "rgba(248,242,228,0.18)",
};

const inkColor = {
  gold: "#CE9A3C",
  teal: "#4A8884",
  indigo: "#5C6FA8",
  red: "#BD5440",
  plum: "#8E6A99",
  forest: "#6E8C5A",
};

const fontDisplay = "'Fraunces', Georgia, serif";
const fontBody = "'Inter', system-ui, -apple-system, sans-serif";
const fontMono = "'IBM Plex Mono', 'Courier New', monospace";

const featureList = [
  { id: "bullets", label: "Bullet generator", desc: "Add polished project bullets", color: inkColor.gold, stamp: "+", rotate: -6 },
  { id: "ats", label: "ATS score check", desc: "Match score against the JD", color: inkColor.teal, stamp: "%", rotate: 4 },
  { id: "cover", label: "Cover letter", desc: "A tailored letter, drafted", color: inkColor.indigo, stamp: "@", rotate: -3 },
  { id: "roast", label: "Resume roast", desc: "Honest, unfiltered feedback", color: inkColor.red, stamp: "!", rotate: 7 },
  { id: "interview", label: "Interview prep", desc: "Questions on your own projects", color: inkColor.plum, stamp: "?", rotate: -5 },
  { id: "linkedin", label: "LinkedIn profile", desc: "Headline, bio and outreach", color: inkColor.forest, stamp: "in", rotate: 3 },
];

const callApi = async (endpoint, body) => {
  try {
    const res = await fetch(`http://127.0.0.1:8000${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error("Server error");
    return await res.json();
  } catch (err) {
    alert("Something went wrong. Check your connection or try again in a moment.");
    return null;
  }
};

function Stamp({ color, label, size = 40, rotate = 0 }) {
  return (
    <div style={{
      width: size, height: size, minWidth: size, borderRadius: "50%",
      border: `2px solid ${color}`, display: "flex", alignItems: "center",
      justifyContent: "center", color, fontFamily: fontMono,
      fontSize: size * 0.32, fontWeight: 700, transform: `rotate(${rotate}deg)`,
      flexShrink: 0, boxSizing: "border-box",
    }}>{label}</div>
  );
}

function StepItem({ num, label, done, active }) {
  const color = done ? inkColor.forest : active ? inkColor.gold : theme.lineLight;
  const textColor = done || active ? theme.cream : theme.muted;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, width: 110 }}>
      <Stamp color={color} label={done ? "✓" : num} size={36} rotate={done ? -4 : 0} />
      <span style={{ fontFamily: fontMono, fontSize: 10, letterSpacing: "1px", textTransform: "uppercase", color: textColor, textAlign: "center" }}>{label}</span>
    </div>
  );
}

function Connector({ done }) {
  return <div style={{ flex: "0 0 36px", height: 0, borderTop: `2px dashed ${done ? inkColor.forest : theme.lineLight}`, marginTop: 18 }} />;
}

function Card({ children, accent }) {
  return (
    <div style={{
      background: theme.paper, borderRadius: 6, padding: "26px 28px",
      marginBottom: 22, boxShadow: "0 10px 28px rgba(0,0,0,0.22)",
      borderTop: `4px solid ${accent || theme.line}`,
      fontFamily: fontBody, color: theme.ink,
    }}>{children}</div>
  );
}

function CardTitle({ children, sub }) {
  return (
    <div style={{ marginBottom: 18 }}>
      <h2 style={{ fontFamily: fontDisplay, fontWeight: 600, fontSize: 21, margin: 0, color: theme.ink }}>{children}</h2>
      {sub && <p style={{ fontFamily: fontBody, fontSize: 13, color: theme.muted, margin: "6px 0 0" }}>{sub}</p>}
    </div>
  );
}

function Field({ as = "input", accent = inkColor.gold, ...props }) {
  const Tag = as;
  return (
    <Tag
      className="field"
      style={{
        "--accent": accent,
        width: "100%", padding: "9px 2px", marginBottom: 14,
        border: "none", borderBottom: `2px solid ${theme.line}`,
        background: "transparent", fontSize: 15, fontFamily: fontBody,
        color: theme.ink, outline: "none", boxSizing: "border-box",
        resize: as === "textarea" ? "vertical" : "none",
      }}
      {...props}
    />
  );
}

function Btn({ color, onClick, children, disabled }) {
  return (
    <button onClick={onClick} disabled={disabled} style={{
      background: disabled ? theme.muted : color, color: theme.paper,
      border: "none", borderRadius: 4, padding: "12px 26px",
      fontFamily: fontMono, fontSize: 12, fontWeight: 700,
      letterSpacing: "1.5px", textTransform: "uppercase",
      cursor: disabled ? "not-allowed" : "pointer",
    }}>{children}</button>
  );
}

function ResultBox({ content, color, onCopy, highlight }) {
  return (
    <div style={{
      marginTop: 20, background: theme.bg, color: theme.cream,
      borderRadius: 4, padding: "20px 24px", borderLeft: `4px solid ${color}`,
      fontFamily: fontBody, fontSize: 14, lineHeight: 1.75,
    }}>
      {content.split("\n").map((line, i) => {
        const isHeader = highlight && highlight.some((h) => line.startsWith(h));
        return (
          <p key={i} style={{
            margin: "5px 0",
            fontFamily: isHeader ? fontMono : fontBody,
            fontWeight: isHeader ? 700 : 400,
            color: isHeader ? color : theme.cream,
            letterSpacing: isHeader ? "0.5px" : "normal",
          }}>{line}</p>
        );
      })}
      <button onClick={onCopy} style={{
        marginTop: 14, background: "transparent", color: theme.cream,
        border: `1px solid ${theme.lineLight}`, padding: "6px 16px",
        borderRadius: 4, fontFamily: fontMono, fontSize: 11,
        letterSpacing: "1.5px", textTransform: "uppercase", cursor: "pointer",
      }}>Copy</button>
    </div>
  );
}

export default function App() {
  const [file, setFile] = useState(null);
  const [resumeParsed, setResumeParsed] = useState(false);
  const [resumeText, setResumeText] = useState("");
  const [jdText, setJdText] = useState("");
  const [jdSubmitted, setJdSubmitted] = useState(false);
  const [activeFeature, setActiveFeature] = useState("");
  const [loading, setLoading] = useState(false);

  const [bullets, setBullets] = useState("");
  const [projectName, setProjectName] = useState("");
  const [techStack, setTechStack] = useState("");
  const [description, setDescription] = useState("");
  const [atsResult, setAtsResult] = useState("");
  const [coverLetter, setCoverLetter] = useState("");
  const [applicantName, setApplicantName] = useState("");
  const [studyYear, setStudyYear] = useState("");
  const [roastResult, setRoastResult] = useState("");
  const [interviewQuestions, setInterviewQuestions] = useState("");
  const [linkedinBio, setLinkedinBio] = useState("");
  const [targetRole, setTargetRole] = useState("");

  const parseResume = async () => {
    if (!file) return alert("Please select a PDF file first.");
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("http://127.0.0.1:8000/parse-resume", { method: "POST", body: formData });
      if (!res.ok) throw new Error("Server error");
      const data = await res.json();
      setResumeText(data.resume_text);
      setResumeParsed(true);
    } catch (err) {
      alert("Could not parse resume. Please check the file and try again.");
    }
    setLoading(false);
  };

  const handleJdSubmit = () => {
    if (!jdText) return alert("Please paste a job description first.");
    setJdSubmitted(true);
    setActiveFeature("");
  };

  const generateBullets = async () => {
    if (!projectName || !techStack || !description) return alert("Fill in all three fields.");
    setLoading(true);
    const data = await callApi("/generate-bullets", { project_name: projectName, tech_stack: techStack, description });
    if (data) setBullets(data.bullets);
    setLoading(false);
  };

  const checkAts = async () => {
    setLoading(true);
    const data = await callApi("/ats-score", { resume_text: resumeText, job_description: jdText });
    if (data) setAtsResult(data.result);
    setLoading(false);
  };

  const generateCoverLetter = async () => {
    if (!applicantName || !studyYear) return alert("Add your name and year of study.");
    setLoading(true);
    const data = await callApi("/cover-letter", { resume_text: resumeText, job_description: jdText, name: applicantName, study_year: studyYear });
    if (data) setCoverLetter(data.cover_letter);
    setLoading(false);
  };

  const roastMyResume = async () => {
    setLoading(true);
    const data = await callApi("/roast-resume", { resume_text: resumeText });
    if (data) setRoastResult(data.roast);
    setLoading(false);
  };

  const generateInterviewPrep = async () => {
    setLoading(true);
    const data = await callApi("/interview-prep", { resume_text: resumeText, job_description: jdText });
    if (data) setInterviewQuestions(data.questions);
    setLoading(false);
  };

  const generateLinkedinBio = async () => {
    if (!targetRole) return alert("Enter your target role.");
    setLoading(true);
    const data = await callApi("/linkedin-bio", { resume_text: resumeText, target_role: targetRole });
    if (data) setLinkedinBio(data.bio);
    setLoading(false);
  };

  return (
    <div style={{ minHeight: "100vh", background: theme.bg }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600&family=Inter:wght@400;500;600&family=IBM+Plex+Mono:wght@500;700&display=swap');
        .field { transition: border-color .15s ease; }
        .field:focus { border-bottom-color: var(--accent) !important; }
        .feature-card { transition: transform .15s ease, box-shadow .15s ease, border-color .15s ease; }
        .feature-card:hover { transform: translateY(-2px); box-shadow: 0 6px 18px rgba(0,0,0,0.18); }
      `}</style>

      {/* Header */}
      <div style={{ padding: "52px 20px 36px", textAlign: "center" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 18 }}>
          <Stamp color={inkColor.gold} label="AI" size={54} rotate={-8} />
          <div style={{ textAlign: "left" }}>
            <h1 style={{ fontFamily: fontDisplay, fontWeight: 600, fontSize: 36, color: theme.cream, margin: 0 }}>Resume Builder</h1>
            <p style={{ fontFamily: fontMono, fontSize: 11, color: inkColor.gold, margin: "6px 0 0", letterSpacing: "2px", textTransform: "uppercase" }}>
              draft → review → submit
            </p>
          </div>
        </div>
      </div>

      {/* Progress */}
      <div style={{ display: "flex", justifyContent: "center", alignItems: "flex-start", marginBottom: 44 }}>
        <StepItem num="1" label="Upload resume" done={resumeParsed} active={!resumeParsed} />
        <Connector done={resumeParsed} />
        <StepItem num="2" label="Paste job description" done={jdSubmitted} active={resumeParsed && !jdSubmitted} />
        <Connector done={jdSubmitted} />
        <StepItem num="3" label="Choose a tool" done={false} active={jdSubmitted} />
      </div>

      <div style={{ maxWidth: 720, margin: "0 auto", padding: "0 16px 60px" }}>

        {/* Step 1 */}
        <Card accent={resumeParsed ? inkColor.forest : inkColor.gold}>
          <CardTitle sub="Upload the resume PDF this session will work from.">Upload your resume</CardTitle>
          <div style={{ border: `2px dashed ${theme.line}`, borderRadius: 4, padding: "18px", marginBottom: 16, textAlign: "center" }}>
            <input
              type="file"
              accept=".pdf"
              onChange={(e) => { setFile(e.target.files[0]); setResumeParsed(false); }}
              style={{ fontFamily: fontBody, fontSize: 14 }}
            />
            <div style={{ marginTop: 8, fontFamily: fontMono, fontSize: 10, letterSpacing: "1.5px", textTransform: "uppercase", color: theme.muted }}>
              PDF only
            </div>
          </div>
          <Btn color={resumeParsed ? inkColor.forest : inkColor.gold} onClick={parseResume} disabled={resumeParsed}>
            {loading && !resumeParsed ? "Reading…" : resumeParsed ? "Resume read ✓" : "Read resume"}
          </Btn>
          {resumeParsed && (
            <p style={{ marginTop: 14, fontFamily: fontMono, fontSize: 12, color: inkColor.forest, letterSpacing: "0.5px" }}>
              Resume on file — continue to step 2.
            </p>
          )}
        </Card>

        {/* Step 2 */}
        {resumeParsed && (
          <Card accent={jdSubmitted ? inkColor.forest : inkColor.teal}>
            <CardTitle sub="Paste the job description you're targeting. Every tool below uses this.">Paste the job description</CardTitle>
            <Field
              as="textarea"
              accent={inkColor.teal}
              placeholder="Paste the job description here..."
              value={jdText}
              onChange={(e) => { setJdText(e.target.value); setJdSubmitted(false); }}
              rows={6}
            />
            <Btn color={inkColor.teal} onClick={handleJdSubmit}>
              {jdSubmitted ? "Saved — edit anytime" : "Save job description"}
            </Btn>
          </Card>
        )}

        {/* Step 3 */}
        {jdSubmitted && (
          <Card accent={inkColor.indigo}>
            <CardTitle sub="Each tool reads the resume and job description above.">Choose a tool</CardTitle>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              {featureList.map((f) => (
                <div
                  key={f.id}
                  className="feature-card"
                  onClick={() => setActiveFeature(activeFeature === f.id ? "" : f.id)}
                  style={{
                    display: "flex", alignItems: "center", gap: 12,
                    border: `1.5px solid ${activeFeature === f.id ? f.color : theme.line}`,
                    borderRadius: 4, padding: 14, cursor: "pointer",
                    background: activeFeature === f.id ? `${f.color}14` : "transparent",
                  }}
                >
                  <Stamp color={f.color} label={f.stamp} size={38} rotate={f.rotate} />
                  <div>
                    <div style={{ fontFamily: fontDisplay, fontWeight: 600, fontSize: 14, color: theme.ink }}>{f.label}</div>
                    <div style={{ fontFamily: fontBody, fontSize: 11, color: theme.muted, marginTop: 2 }}>{f.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Bullet Generator */}
        {activeFeature === "bullets" && (
          <Card accent={inkColor.gold}>
            <CardTitle sub="Describe a project. Get three ATS-friendly bullets back.">Bullet generator</CardTitle>
            <Field accent={inkColor.gold} placeholder="Project name" value={projectName} onChange={(e) => setProjectName(e.target.value)} />
            <Field accent={inkColor.gold} placeholder="Tech stack (e.g. Python, OpenCV, MediaPipe)" value={techStack} onChange={(e) => setTechStack(e.target.value)} />
            <Field accent={inkColor.gold} placeholder="What it does, in one line" value={description} onChange={(e) => setDescription(e.target.value)} />
            <Btn color={inkColor.gold} onClick={generateBullets}>{loading ? "Writing…" : "Generate bullets"}</Btn>
            {bullets && <ResultBox content={bullets} color={inkColor.gold} onCopy={() => navigator.clipboard.writeText(bullets)} />}
          </Card>
        )}

        {/* ATS Score */}
        {activeFeature === "ats" && (
          <Card accent={inkColor.teal}>
            <CardTitle sub="Compares your resume against the job description from step 2.">ATS score check</CardTitle>
            <Btn color={inkColor.teal} onClick={checkAts}>{loading ? "Checking…" : "Check score"}</Btn>
            {atsResult && <ResultBox content={atsResult} color={inkColor.teal} highlight={["SCORE"]} onCopy={() => navigator.clipboard.writeText(atsResult)} />}
          </Card>
        )}

        {/* Cover Letter */}
        {activeFeature === "cover" && (
          <Card accent={inkColor.indigo}>
            <CardTitle sub="A short letter, tailored to the job description from step 2.">Cover letter</CardTitle>
            <Field accent={inkColor.indigo} placeholder="Your full name" value={applicantName} onChange={(e) => setApplicantName(e.target.value)} />
            <Field accent={inkColor.indigo} placeholder="Year of study (e.g. 2nd year, Final year)" value={studyYear} onChange={(e) => setStudyYear(e.target.value)} />
            <Btn color={inkColor.indigo} onClick={generateCoverLetter}>{loading ? "Drafting…" : "Draft cover letter"}</Btn>
            {coverLetter && <ResultBox content={coverLetter} color={inkColor.indigo} onCopy={() => navigator.clipboard.writeText(coverLetter)} />}
          </Card>
        )}

        {/* Resume Roaster */}
        {activeFeature === "roast" && (
          <Card accent={inkColor.red}>
            <CardTitle sub="Unfiltered feedback — funny, but with real fixes underneath.">Resume roast</CardTitle>
            <Btn color={inkColor.red} onClick={roastMyResume}>{loading ? "Reviewing…" : "Roast my resume"}</Btn>
            {roastResult && <ResultBox content={roastResult} color={inkColor.red} highlight={["OVERALL", "FINAL"]} onCopy={() => navigator.clipboard.writeText(roastResult)} />}
          </Card>
        )}

        {/* Interview Prep */}
        {activeFeature === "interview" && (
          <Card accent={inkColor.plum}>
            <CardTitle sub="Questions built from your actual projects and the job description.">Interview prep</CardTitle>
            <Btn color={inkColor.plum} onClick={generateInterviewPrep}>{loading ? "Preparing…" : "Generate questions"}</Btn>
            {interviewQuestions && (
              <ResultBox
                content={interviewQuestions}
                color={inkColor.plum}
                highlight={["🧠", "💻", "🤔", "🎯", "⚡", "💡"]}
                onCopy={() => navigator.clipboard.writeText(interviewQuestions)}
              />
            )}
          </Card>
        )}

        {/* LinkedIn Bio */}
        {activeFeature === "linkedin" && (
          <Card accent={inkColor.forest}>
            <CardTitle sub="Headline, about section, and outreach messages for one role.">LinkedIn profile</CardTitle>
            <Field accent={inkColor.forest} placeholder="Target role (e.g. ML Intern, Data Science Intern)" value={targetRole} onChange={(e) => setTargetRole(e.target.value)} />
            <Btn color={inkColor.forest} onClick={generateLinkedinBio}>{loading ? "Writing…" : "Generate profile"}</Btn>
            {linkedinBio && (
              <ResultBox
                content={linkedinBio}
                color={inkColor.forest}
                highlight={["🎯", "📝", "🔗", "📨", "🏷️"]}
                onCopy={() => navigator.clipboard.writeText(linkedinBio)}
              />
            )}
          </Card>
        )}

        {/* Footer */}
        <div style={{ textAlign: "center", marginTop: 30, paddingTop: 20, borderTop: `1px solid ${theme.lineLight}` }}>
          <span style={{ fontFamily: fontMono, fontSize: 10, letterSpacing: "2px", textTransform: "uppercase", color: theme.lineLight }}>
            — filed and ready —
          </span>
        </div>
      </div>
    </div>
  );
}