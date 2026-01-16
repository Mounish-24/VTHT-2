from pydantic import BaseModel
from typing import Optional, List

# --- AUTH & LOGIN ---
class Token(BaseModel):
    access_token: str
    token_type: str
    role: str
    user_id: str

class LoginData(BaseModel):
    username: str
    password: str

# --- USER SCHEMAS ---
class UserBase(BaseModel):
    id: str
    role: str

class User(UserBase):
    class Config:
        from_attributes = True

# --- FACULTY SCHEMAS ---
class FacultyBase(BaseModel):
    staff_no: str
    name: str
    designation: str
    doj: str

class Faculty(FacultyBase):
    class Config:
        from_attributes = True

# --- STUDENT SCHEMAS ---
class StudentBase(BaseModel):
    roll_no: str
    name: str
    year: int
    semester: int
    cgpa: float
    attendance_percentage: float

class Student(StudentBase):
    class Config:
        from_attributes = True

# --- COURSE SCHEMAS ---
class CourseBase(BaseModel):
    code: str
    title: str
    semester: int
    credits: int
    category: Optional[str] = None

class CourseCreate(CourseBase):
    pass

class Course(CourseBase):
    class Config:
        from_attributes = True

# --- MARKS SYNC SCHEMAS ---
class MarkSyncRequest(BaseModel):
    student_roll_no: str
    course_code: str
    cia1_marks: float
    cia1_retest: float
    cia2_marks: float
    cia2_retest: float
    subject_attendance: float

# --- ANNOUNCEMENT & MATERIAL SCHEMAS ---
class AnnouncementCreate(BaseModel):
    title: str
    content: str
    type: str                        # "Department" or "Subject"
    posted_by: str                   # Matches models.py
    course_code: Optional[str] = None

class Announcement(AnnouncementCreate):
    id: int
    class Config:
        from_attributes = True

class MaterialCreate(BaseModel):
    course_code: str
    type: str                        # "Lecture Notes", "Question Bank", etc.
    title: str
    file_link: str
    posted_by: str                   # Synced to match models.py

class Material(MaterialCreate):
    id: int
    class Config:
        from_attributes = True