import json
from sqlalchemy.orm import Session
from .database import SessionLocal, engine
from . import models
from datetime import datetime

# Ensure tables exist with the newest schema
models.Base.metadata.create_all(bind=engine)

db = SessionLocal()

# --- 1. ADMIN SEEDING (Maintained) ---
admin = db.query(models.User).filter(models.User.id == "admin").first()
if not admin:
    admin_user = models.User(id="admin", role="Admin", password="admin123")
    db.add(admin_user)
    db.commit()
    print("Admin created - seed.py:18")

# --- 2. FACULTY SEEDING (Maintained IDs/Pass) ---
faculty_data = [
  {"id": "HTS 1794", "name": "Dr. Sankar", "designation": "Professor", "doj": "20.01.2025"},
  {"id": "HTS 1856", "name": "Dr. S. Zulaikha Beevi", "designation": "Professor", "doj": "16.06.2025"},
  {"id": "HTS 1766", "name": "Dr. G. Mahalakshmi", "designation": "Associate Professor", "doj": "02.07.2024"},
  {"id": "HTS 1821", "name": "Dr. S. Sathish Kumar", "designation": "Associate Professor", "doj": "04.06.2025"},
  {"id": "HTS 1488", "name": "Mrs. Veerasundari R", "designation": "Assistant Professor", "doj": "02-Mar-2020"},
  {"id": "HTS 1527", "name": "Mrs. Vasanthapriya M J T", "designation": "Assistant Professor", "doj": "26-Nov-2020"},
  {"id": "HTS 1655", "name": "Mrs. Geetha L", "designation": "Assistant Professor & HOD", "doj": "13-Feb-2023"},
  {"id": "HTS 1664", "name": "Mrs. Priya R V", "designation": "Assistant Professor", "doj": "13-Jun-2023"},
  {"id": "HTS 1711", "name": "Mr. Balaji M", "designation": "Assistant Professor", "doj": "23-Dec-2023"},
  {"id": "HTS 1745", "name": "Mrs. Ranjani R", "designation": "Assistant Professor", "doj": "18-May-2024"},
  {"id": "HTS 1767", "name": "Ms. Preethi M", "designation": "Assistant Professor", "doj": "04.07.2024"},
  {"id": "HTS 1774", "name": "Ms. Nivetha P", "designation": "Assistant Professor", "doj": "22.07.2024"},
  {"id": "HTS 1717", "name": "Mr. Ramajayam A", "designation": "Assistant Professor", "doj": "24-Jan-2024"},
  {"id": "HTS 1725", "name": "Ms. Tamil Selvi B", "designation": "Assistant Professor", "doj": "15-Feb-2024"},
  {"id": "HTS 1775", "name": "Ms. Harini P", "designation": "Assistant Professor", "doj": "25.07.2024"},
  {"id": "HTS 1791", "name": "Mr. Umanath", "designation": "Assistant Professor", "doj": "08.01.2025"},
  {"id": "HTS 1792", "name": "Mr. Balaarunesh G", "designation": "Assistant Professor", "doj": "13.01.2025"},
  {"id": "HTS 1801", "name": "Ms. Suganya Devi S", "designation": "Assistant Professor", "doj": "22.01.2025"},
  {"id": "HTS 1802", "name": "Mr. Samuel Dinesh Hynes N", "designation": "Assistant Professor", "doj": "23.01.2025"},
  {"id": "HTS 1819", "name": "Ms. Kuppu Lakshmi", "designation": "Assistant Professor", "doj": "15.02.2025"},
  {"id": "HTS 1857", "name": "Mr. Vishnu Vamsi Nunna", "designation": "Assistant Professor", "doj": "16.06.2025"},
  {"id": "HTS 1865", "name": "Mr. Ahamed Haris", "designation": "Assistant Professor", "doj": "26.06.2025"},
  {"id": "HTS 1900", "name": "Ms. Pavithra M", "designation": "Assistant Professor", "doj": "08.09.2025"}
]

def parse_date_to_password(date_str):
    try:
        if "." in date_str:
            d = datetime.strptime(date_str, "%d.%m.%Y")
            return d.strftime("%d%m%Y")
        elif "-" in date_str:
            d = datetime.strptime(date_str, "%d-%b-%Y")
            return d.strftime("%d%m%Y")
    except:
        return "12345678"
    return "12345678"

for f in faculty_data:
    if not db.query(models.User).filter(models.User.id == f["id"]).first():
        password = parse_date_to_password(f["doj"])
        role = "HOD" if "HOD" in f["designation"] else "Faculty"
        db.add(models.User(id=f["id"], role=role, password=password))
        db.add(models.Faculty(staff_no=f["id"], name=f["name"], designation=f["designation"], doj=f["doj"]))

# --- 3. CURRICULUM ---
curriculum_data = [
  {"sem": 5, "code": "CS3401", "title": "Artificial Intelligence", "credits": 3},
  {"sem": 5, "code": "MA3151", "title": "Matrices & Calculus", "credits": 4},
  {"sem": 5, "code": "21HI53IT", "title": "Web Technology", "credits": 4}
]

for c in curriculum_data:
    if not db.query(models.Course).filter(models.Course.code == c["code"]).first():
        db.add(models.Course(code=c["code"], title=c["title"], semester=c["sem"], credits=c["credits"]))

# --- 4. STUDENT SEEDING (Maintained IDs/Pass) ---
students_to_seed = [
    {"id": "21AD001", "name": "Original Student", "pass": "01012000", "cgpa": 8.5, "att": 85},
    {"id": "21AD002", "name": "Bhavani S", "pass": "pass002", "cgpa": 9.1, "att": 92},
    {"id": "21AD003", "name": "Sankar P", "pass": "pass003", "cgpa": 7.8, "att": 74},
    {"id": "21AD004", "name": "Deepak R", "pass": "pass004", "cgpa": 8.2, "att": 88},
    {"id": "21AD005", "name": "Ishwarya M", "pass": "pass005", "cgpa": 8.9, "att": 95},
    {"id": "21AD006", "name": "Karthik G", "pass": "pass006", "cgpa": 7.5, "att": 70},
    {"id": "21AD007", "name": "Meena R", "pass": "pass007", "cgpa": 9.5, "att": 98},
    {"id": "21AD008", "name": "Naveen J", "pass": "pass008", "cgpa": 6.8, "att": 65},
    {"id": "21AD009", "name": "Priyanka V", "pass": "pass009", "cgpa": 8.7, "att": 89},
    {"id": "21AD010", "name": "Rahul T", "pass": "pass010", "cgpa": 7.2, "att": 78},
]

sem5_course_codes = [c["code"] for c in curriculum_data if c["sem"] == 5]

for s in students_to_seed:
    if not db.query(models.User).filter(models.User.id == s["id"]).first():
        db.add(models.User(id=s["id"], role="Student", password=s["pass"]))
    
    if not db.query(models.Student).filter(models.Student.roll_no == s["id"]).first():
        db.add(models.Student(
            roll_no=s["id"], 
            name=s["name"], 
            year=3, 
            semester=5, 
            cgpa=s["cgpa"], 
            attendance_percentage=s["att"]
        ))
    
    # --- FIXED ACADEMIC DATA SEEDING ---
    for code in sem5_course_codes:
        existing_enrollment = db.query(models.AcademicData).filter(
            models.AcademicData.student_roll_no == s["id"],
            models.AcademicData.course_code == code
        ).first()
        
        if not existing_enrollment:
            # Updated to match the new columns in models.py
            db.add(models.AcademicData(
                student_roll_no=s["id"], 
                course_code=code, 
                status="Pursuing",
                cia1_marks=0.0,
                cia1_retest=0.0,
                cia2_marks=0.0,
                cia2_retest=0.0,
                subject_attendance=float(s["att"]), # Fix for subject attendance sync
                innovative_assignment_marks=0.0
            ))

db.commit()
print("Seeding Complete: All columns aligned with models.py! - seed.py:129")
db.close()