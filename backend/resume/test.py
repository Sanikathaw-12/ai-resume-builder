from chains import generate_project_bullets

projects = [
    {
        "name": "Celebrity Lookalike",
        "stack": "Python, OpenCV, face_recognition",
        "description": "Detects which celebrity a user looks like using face comparison"
    },
    {
        "name": "Movie Recommender",
        "stack": "Python, Scikit-learn, Cosine Similarity, Streamlit",
        "description": "Recommends movies based on user preferences using ML"
    },
    {
        "name": "Diabetes Dashboard",
        "stack": "Python, Tableau, ML, Pandas",
        "description": "Healthcare dashboard with diabetes prediction using ML model"
    }
]

for p in projects:
    print(f"\n--- {p['name']} ---")
    bullets = generate_project_bullets(p["name"], p["stack"], p["description"])
    print(bullets)