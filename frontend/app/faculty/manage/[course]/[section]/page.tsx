'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';
import { API_URL } from '@/config';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Save, FileUp, UserCheck, ArrowLeft, Search, Loader2, Megaphone, BookOpen, FileText, ClipboardList } from 'lucide-react';

export default function SectionManagement() {
    const params = useParams();
    const router = useRouter();
    const courseCode = params.course;
    const sectionName = params.section || "A";

    // States
    const [students, setStudents] = useState<any[]>([]);
    const [filteredStudents, setFilteredStudents] = useState<any[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeAction, setActiveAction] = useState('marks');
    const [isSaving, setIsSaving] = useState(false);
    const [uploading, setUploading] = useState(false);

    // Form States for Subject Announcement
    const [subAnn, setSubAnn] = useState({ title: '', content: '' });

    // --- 1. INITIAL FETCH ---
    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.get(`${API_URL}/marks/section?course_code=${courseCode}`);
                setStudents(res.data);
                setFilteredStudents(res.data);
            } catch (error) {
                console.error("Error fetching students", error);
            }
        };
        fetchData();
    }, [courseCode]);

    // --- 2. SEARCH LOGIC ---
    useEffect(() => {
        const filtered = students.filter(s =>
            s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            s.roll_no.includes(searchQuery)
        );
        setFilteredStudents(filtered);
    }, [searchQuery, students]);

    const handleMarkChange = (roll_no: string, field: string, value: string) => {
        const updated = students.map(s => s.roll_no === roll_no ? { ...s, [field]: value } : s);
        setStudents(updated);
    };

    // --- 3. SAVE MARKS LOGIC ---
    const handleSaveMarks = async () => {
        setIsSaving(true);
        try {
            const savePromises = students.map(student =>
                axios.post(`${API_URL}/marks/sync`, {
                    student_roll_no: student.roll_no,
                    course_code: courseCode,
                    cia1_marks: Number(student.cia1_marks),
                    cia1_retest: Number(student.cia1_retest),
                    cia2_marks: Number(student.cia2_marks),
                    cia2_retest: Number(student.cia2_retest),
                    subject_attendance: Number(student.subject_attendance)
                })
            );
            await Promise.all(savePromises);
            alert(`✅ Success! Marks & Attendance synced for ${courseCode}.`);
        } catch (error) {
            alert("Failed to sync marks.");
        } finally {
            setIsSaving(false);
        }
    };

    // --- 4. MATERIAL UPLOAD LOGIC ---
    const handleFileUpload = async (type: string, titleId: string) => {
        const titleInput = document.getElementById(titleId) as HTMLInputElement;
        const title = titleInput?.value;
        const userId = localStorage.getItem('user_id');

        if (!title) { alert("Please provide a title for the file."); return; }

        // Safety Check: Backend will return 422 if posted_by is missing
        if (!userId) {
            alert("Session expired. Please login again.");
            router.push('/login');
            return;
        }

        setUploading(true);
        try {
            await axios.post(`${API_URL}/materials`, {
                course_code: courseCode,
                type: type,
                title: title,
                file_link: "#", // Placeholder for actual file upload logic
                posted_by: userId // Synchronized with schemas.py
            });
            alert(`📁 ${type} uploaded successfully!`);
            if (titleInput) titleInput.value = "";
        } catch (error) {
            console.error("Upload failed:", error);
            alert("Upload failed. Check terminal for 422 error.");
        } finally {
            setUploading(false);
        }
    };

    // --- 5. SUB-ANNOUNCEMENT LOGIC ---
    const handlePostSubAnnouncement = async (e: React.FormEvent) => {
        e.preventDefault();
        const userId = localStorage.getItem('user_id');

        if (!userId) { alert("Please login again."); return; }

        try {
            await axios.post(`${API_URL}/announcements`, {
                title: subAnn.title,
                content: subAnn.content,
                type: "Subject", // This identifies it for the Subject page specifically
                course_code: courseCode,
                posted_by: userId // Synchronized with schemas.py
            });
            alert(`📢 Subject Announcement posted for ${courseCode}!`);
            setSubAnn({ title: '', content: '' });
        } catch (error) {
            console.error("Failed to post:", error);
            alert("Failed to post announcement.");
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <Navbar />
            <div className="container mx-auto px-4 py-8 flex-grow">

                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div>
                        <button onClick={() => router.back()} className="flex items-center gap-2 text-blue-900 font-bold hover:underline mb-2">
                            <ArrowLeft size={18} /> Back to Dashboard
                        </button>
                        <h1 className="text-3xl font-bold text-blue-900 uppercase">{courseCode} - SECTION {sectionName}</h1>
                        <p className="text-gray-600 font-medium">Subject Management Portal</p>
                    </div>

                    <div className="flex gap-2">
                        <button
                            onClick={() => setActiveAction('marks')}
                            className={`px-5 py-2 rounded-lg font-bold transition flex items-center gap-2 ${activeAction === 'marks' ? 'bg-blue-900 text-white shadow-lg' : 'bg-white border text-gray-600'}`}
                        >
                            <UserCheck size={18} /> Marks & Attendance
                        </button>
                        <button
                            onClick={() => setActiveAction('uploads')}
                            className={`px-5 py-2 rounded-lg font-bold transition flex items-center gap-2 ${activeAction === 'uploads' ? 'bg-blue-900 text-white shadow-lg' : 'bg-white border text-gray-600'}`}
                        >
                            <FileUp size={18} /> Materials & Announcements
                        </button>
                    </div>
                </div>

                {/* --- TAB 1: MARKS --- */}
                {activeAction === 'marks' && (
                    <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
                        <div className="p-4 bg-gray-50 border-b flex flex-col sm:flex-row justify-between gap-4">
                            <div className="relative w-full sm:w-72">
                                <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
                                <input
                                    type="text"
                                    placeholder="Search Roll No..."
                                    className="pl-10 pr-4 py-2 w-full border rounded-lg outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                            <button
                                onClick={handleSaveMarks}
                                disabled={isSaving}
                                className="bg-green-600 text-white px-6 py-2 rounded-lg font-bold flex items-center justify-center gap-2 hover:bg-green-700 transition"
                            >
                                {isSaving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                                Save & Sync to Students
                            </button>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-blue-900 text-white text-[10px] uppercase tracking-wider font-bold">
                                    <tr>
                                        <th className="p-4">Roll No</th>
                                        <th className="p-4">Name</th>
                                        <th className="p-4 text-center">CIA 1 (60)</th>
                                        <th className="p-4 text-center bg-blue-800">C1 Retest</th>
                                        <th className="p-4 text-center">CIA 2 (60)</th>
                                        <th className="p-4 text-center bg-blue-800">C2 Retest</th>
                                        <th className="p-4 text-center">Att %</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredStudents.map((stu) => (
                                        <tr key={stu.roll_no} className="hover:bg-blue-50 border-b transition text-sm font-medium">
                                            <td className="p-4 font-bold text-gray-700">{stu.roll_no}</td>
                                            <td className="p-4 text-gray-800">{stu.name}</td>
                                            <td className="p-4 text-center">
                                                <input type="number" value={stu.cia1_marks} onChange={(e) => handleMarkChange(stu.roll_no, 'cia1_marks', e.target.value)}
                                                    className={`w-14 border rounded p-1 text-center font-bold ${Number(stu.cia1_marks) < 30 ? 'text-red-600 border-red-300 bg-red-50' : 'text-gray-700'}`} />
                                            </td>
                                            <td className="p-4 text-center bg-gray-50/50">
                                                <input type="number" value={stu.cia1_retest} onChange={(e) => handleMarkChange(stu.roll_no, 'cia1_retest', e.target.value)}
                                                    className={`w-14 border rounded p-1 text-center font-bold ${Number(stu.cia1_retest) < 30 ? 'text-red-600 border-red-300 bg-red-50' : 'text-gray-700'}`} />
                                            </td>
                                            <td className="p-4 text-center">
                                                <input type="number" value={stu.cia2_marks} onChange={(e) => handleMarkChange(stu.roll_no, 'cia2_marks', e.target.value)}
                                                    className={`w-14 border rounded p-1 text-center font-bold ${Number(stu.cia2_marks) < 30 ? 'text-red-600 border-red-300 bg-red-50' : 'text-gray-700'}`} />
                                            </td>
                                            <td className="p-4 text-center bg-gray-50/50">
                                                <input type="number" value={stu.cia2_retest} onChange={(e) => handleMarkChange(stu.roll_no, 'cia2_retest', e.target.value)}
                                                    className={`w-14 border rounded p-1 text-center font-bold ${Number(stu.cia2_retest) < 30 ? 'text-red-600 border-red-300 bg-red-50' : 'text-gray-700'}`} />
                                            </td>
                                            <td className="p-4 text-center font-bold text-blue-900">
                                                <input type="number" value={stu.subject_attendance} onChange={(e) => handleMarkChange(stu.roll_no, 'subject_attendance', e.target.value)}
                                                    className="w-14 border rounded p-1 text-center border-blue-200" />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* --- TAB 2: UPLOADS --- */}
                {activeAction === 'uploads' && (
                    <div className="space-y-8 animate-in fade-in duration-500">
                        {/* Material Upload Boxes */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* Lecture Notes */}
                            <div className="bg-white p-6 rounded-xl shadow-md border-t-4 border-blue-900">
                                <div className="flex items-center gap-2 mb-4">
                                    <BookOpen className="text-blue-900" />
                                    <h3 className="font-bold text-lg">Lecture Notes</h3>
                                </div>
                                <input type="text" id="notes-title" placeholder="e.g. Unit 1 AI Intro" className="w-full border p-2 rounded mb-3 text-sm font-medium" />
                                <div className="text-[10px] text-gray-400 mb-1 font-bold uppercase tracking-tight">Choose File</div>
                                <input type="file" className="text-xs mb-4 w-full text-gray-500" />
                                <button
                                    onClick={() => handleFileUpload('Lecture Notes', 'notes-title')}
                                    className="w-full bg-blue-900 text-white py-2 rounded font-bold hover:bg-blue-800 transition"
                                >
                                    Upload Notes
                                </button>
                            </div>

                            {/* Question Bank */}
                            <div className="bg-white p-6 rounded-xl shadow-md border-t-4 border-teal-600">
                                <div className="flex items-center gap-2 mb-4">
                                    <FileText className="text-teal-600" />
                                    <h3 className="font-bold text-lg">Question Bank</h3>
                                </div>
                                <input type="text" id="qb-title" placeholder="e.g. Part B Important" className="w-full border p-2 rounded mb-3 text-sm font-medium" />
                                <div className="text-[10px] text-gray-400 mb-1 font-bold uppercase tracking-tight">Choose File</div>
                                <input type="file" className="text-xs mb-4 w-full text-gray-500" />
                                <button
                                    onClick={() => handleFileUpload('Question Bank', 'qb-title')}
                                    className="w-full bg-teal-600 text-white py-2 rounded font-bold hover:bg-teal-700 transition"
                                >
                                    Upload QB
                                </button>
                            </div>

                            {/* Assignments */}
                            <div className="bg-white p-6 rounded-xl shadow-md border-t-4 border-orange-500">
                                <div className="flex items-center gap-2 mb-4">
                                    <ClipboardList className="text-orange-500" />
                                    <h3 className="font-bold text-lg">Assignments</h3>
                                </div>
                                <input type="text" id="assign-title" placeholder="e.g. Assignment 1" className="w-full border p-2 rounded mb-3 text-sm font-medium" />
                                <div className="text-[10px] text-gray-400 mb-1 font-bold uppercase tracking-tight">Choose File</div>
                                <input type="file" className="text-xs mb-4 w-full text-gray-500" />
                                <button
                                    onClick={() => handleFileUpload('Assignment', 'assign-title')}
                                    className="w-full bg-orange-500 text-white py-2 rounded font-bold hover:bg-orange-600 transition"
                                >
                                    Post Assignment
                                </button>
                            </div>
                        </div>

                        {/* Subject Specific Announcement */}
                        <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-blue-900">
                            <div className="flex items-center gap-2 mb-4">
                                <Megaphone className="text-orange-500" />
                                <h2 className="text-xl font-bold text-blue-900">Post Subject Announcement</h2>
                            </div>
                            <p className="text-sm text-gray-500 mb-4 italic font-medium">
                                *Note: This message will only be visible to students enrolled in {courseCode}.
                            </p>
                            <form onSubmit={handlePostSubAnnouncement} className="space-y-4">
                                <input
                                    className="w-full p-3 border rounded shadow-sm outline-none focus:ring-2 focus:ring-blue-900 font-medium"
                                    placeholder="Announcement Title"
                                    value={subAnn.title}
                                    onChange={(e) => setSubAnn({ ...subAnn, title: e.target.value })}
                                    required
                                />
                                <textarea
                                    className="w-full p-3 border rounded shadow-sm outline-none focus:ring-2 focus:ring-blue-900 h-28 font-medium"
                                    placeholder="Write your message here..."
                                    value={subAnn.content}
                                    onChange={(e) => setSubAnn({ ...subAnn, content: e.target.value })}
                                    required
                                />
                                <button type="submit" className="bg-blue-900 text-white px-8 py-2 rounded-lg font-bold hover:bg-blue-800 transition shadow-md uppercase text-xs tracking-widest">
                                    Broadcast to Class
                                </button>
                            </form>
                        </div>
                    </div>
                )}
            </div>
            <Footer />
        </div>
    );
}