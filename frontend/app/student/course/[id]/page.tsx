'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';
import { API_URL } from '@/config';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { FileText, BookOpen, Bell, CheckCircle, Download, ArrowLeft, ClipboardList } from 'lucide-react'; 

export default function CourseDetailPage() {
    const params = useParams();
    const router = useRouter();
    const courseId = typeof params?.id === 'string' ? decodeURIComponent(params.id) : 'Unknown Course';

    const [activeTab, setActiveTab] = useState('notes');
    const [materials, setMaterials] = useState<any[]>([]);
    const [announcements, setAnnouncements] = useState<any[]>([]);
    const [studentProfile, setStudentProfile] = useState<any>(null);
    // FIXED: Added missing marks state to handle subject-specific attendance
    const [marks, setMarks] = useState<any>(null);

    useEffect(() => {
        const userId = localStorage.getItem('user_id');
        
        const fetchCourseContent = async () => {
            try {
                // 1. Fetch Student Profile
                const stuRes = await axios.get(`${API_URL}/student/${userId}`);
                setStudentProfile(stuRes.data);

                // 2. Fetch Live Materials (Notes, QB, Assignments)
                const matRes = await axios.get(`${API_URL}/materials/${courseId}`);
                setMaterials(matRes.data);

                // 3. Fetch Subject-Specific Announcements
                const annRes = await axios.get(`${API_URL}/announcements?type=Subject&course_code=${courseId}`);
                setAnnouncements(annRes.data);

                // 4. Fetch Student Marks for this specific course to get subject attendance
                const marksRes = await axios.get(`${API_URL}/marks/cia?student_id=${userId}`);
                const specificMark = marksRes.data.find((m: any) => m.subject === courseId);
                setMarks(specificMark);

            } catch (error) {
                console.error("Connection failed:", error);
            }
        };

        if (courseId && userId) fetchCourseContent();
    }, [courseId]);

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <Navbar />
            
            <div className="bg-blue-900 text-white py-10 shadow-lg">
                <div className="container mx-auto px-4">
                    <button onClick={() => router.push('/student')} className="flex items-center gap-2 text-sm hover:text-orange-400 mb-3 opacity-80 transition">
                        <ArrowLeft size={16} /> Back to Dashboard
                    </button>
                    <h1 className="text-4xl font-bold tracking-tight uppercase">{courseId} - Subject Details</h1>
                    <p className="opacity-80 font-medium tracking-wide">Course Resources & Academic Progress</p>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8 flex-grow">
                <div className="bg-white rounded-xl shadow-xl overflow-hidden min-h-[550px] border border-gray-100">
                    
                    {/* TABS SECTION */}
                    <div className="flex overflow-x-auto border-b bg-gray-50/50 sticky top-0 z-10 no-scrollbar">
                        {[
                            { id: 'notes', label: 'Lecture Notes', icon: FileText },
                            { id: 'qb', label: 'Question Bank', icon: BookOpen },
                            { id: 'assignments', label: 'Assignments', icon: ClipboardList },
                            { id: 'announcements', label: 'Announcements', icon: Bell },
                            { id: 'attendance', label: 'Attendance', icon: CheckCircle },
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center px-8 py-5 font-bold transition whitespace-nowrap border-b-4 uppercase text-xs tracking-widest ${
                                    activeTab === tab.id 
                                    ? 'bg-white text-blue-900 border-b-blue-900 border-t-4 border-t-orange-500' 
                                    : 'text-gray-400 hover:text-blue-900 hover:bg-white/80'
                                }`}
                            >
                                <tab.icon size={18} className="mr-2" />
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    <div className="p-8">
                        {/* LECTURE NOTES TAB */}
                        {activeTab === 'notes' && (
                            <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                                <h2 className="text-xl font-bold mb-6 text-gray-800 flex items-center gap-2">
                                    <FileText className="text-blue-900" /> Study Materials
                                </h2>
                                {materials.filter(m => m.type === 'Lecture Notes').length > 0 ? (
                                    materials.filter(m => m.type === 'Lecture Notes').map((note, i) => (
                                        <div key={i} className="flex items-center justify-between p-5 border-b hover:bg-blue-50/50 transition group rounded-lg">
                                            <div className="flex items-center">
                                                <div className="p-3 bg-blue-100 text-blue-600 rounded-lg mr-4">
                                                    <FileText size={20} />
                                                </div>
                                                <p className="font-bold text-gray-800">{note.title}</p>
                                            </div>
                                            <a href={note.file_link} target="_blank" className="flex items-center gap-2 text-blue-900 text-xs font-black border-2 border-blue-900 px-4 py-2 rounded-lg hover:bg-blue-900 hover:text-white transition uppercase">
                                                <Download size={14} /> Download
                                            </a>
                                        </div>
                                    ))
                                ) : <p className="text-center py-20 text-gray-400 italic">No notes uploaded yet.</p>}
                            </div>
                        )}

                        {/* QUESTION BANK TAB */}
                        {activeTab === 'qb' && (
                            <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                                <h2 className="text-xl font-bold mb-6 text-gray-800 flex items-center gap-2">
                                    <BookOpen className="text-teal-600" /> Question Bank
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {materials.filter(m => m.type === 'Question Bank').length > 0 ? (
                                        materials.filter(m => m.type === 'Question Bank').map((q, i) => (
                                            <div key={i} className="p-5 border rounded-xl hover:shadow-lg flex justify-between items-center bg-gray-50 border-gray-100 transition-all">
                                                <span className="font-bold text-gray-800 text-sm uppercase tracking-tighter">{q.title}</span>
                                                <a href={q.file_link} target="_blank" className="text-white bg-teal-600 px-4 py-2 rounded-lg text-xs font-bold hover:bg-teal-700 shadow-md transition uppercase">Download QB</a>
                                            </div>
                                        ))
                                    ) : <p className="text-center py-20 text-gray-400 italic col-span-2">No question bank files found.</p>}
                                </div>
                            </div>
                        )}

                        {/* ASSIGNMENTS TAB */}
                        {activeTab === 'assignments' && (
                            <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                                <h2 className="text-xl font-bold mb-6 text-gray-800 flex items-center gap-2">
                                    <ClipboardList className="text-orange-500" /> Subject Assignments
                                </h2>
                                {materials.filter(m => m.type === 'Assignment').length > 0 ? (
                                    materials.filter(m => m.type === 'Assignment').map((assn, i) => (
                                        <div key={i} className="flex items-center justify-between p-5 border-l-4 border-orange-500 bg-white shadow-sm rounded-r-lg mb-4 hover:shadow-md transition">
                                            <div>
                                                <p className="font-bold text-gray-800 text-lg">{assn.title}</p>
                                                <p className="text-[10px] text-gray-400 font-bold uppercase">Posted by Faculty: {assn.posted_by}</p>
                                            </div>
                                            <a href={assn.file_link} target="_blank" className="bg-orange-500 text-white px-5 py-2 rounded-lg text-xs font-bold hover:bg-orange-600 uppercase tracking-widest transition">
                                                Download Task
                                            </a>
                                        </div>
                                    ))
                                ) : <p className="text-center py-20 text-gray-400 italic">No assignments posted for this course.</p>}
                            </div>
                        )}

                        {/* ANNOUNCEMENT TAB */}
                        {activeTab === 'announcements' && (
                            <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                                <h2 className="text-xl font-bold mb-6 text-gray-800 flex items-center gap-2">
                                    <Bell className="text-yellow-500" /> Subject Notifications
                                </h2>
                                {announcements.length > 0 ? announcements.map((ann, i) => (
                                    <div key={i} className="bg-yellow-50/50 border-l-8 border-yellow-500 p-6 rounded-r-xl mb-4 relative overflow-hidden shadow-sm">
                                        <p className="font-bold text-blue-900 text-lg">{ann.title}</p>
                                        <p className="text-sm text-gray-700 mt-2 font-medium">{ann.content}</p>
                                    </div>
                                )) : <p className="text-center py-20 text-gray-400 italic">No subject announcements.</p>}
                            </div>
                        )}

                        {/* FIXED ATTENDANCE TAB: Pulls marks?.subject_attendance */}
                        {activeTab === 'attendance' && (
                            <div className="text-center py-12 animate-in zoom-in duration-300">
                                <h2 className="text-xl font-bold mb-6 text-gray-800 uppercase tracking-widest">
                                    {courseId} Attendance Analysis
                                </h2>
                                <div className="text-6xl font-black text-blue-900 mb-2">
                                    {marks?.subject_attendance || 0}%
                                </div>
                                <div className="w-64 h-3 bg-gray-100 rounded-full mt-4 mx-auto border overflow-hidden">
                                    <div 
                                        className={`h-full transition-all duration-1000 ${ (marks?.subject_attendance || 0) < 75 ? 'bg-red-500' : 'bg-green-600' }`} 
                                        style={{ width: `${marks?.subject_attendance || 0}%` }}
                                    ></div>
                                </div>
                                <p className="text-gray-500 mt-6 font-medium italic">*Attendance is synced live with faculty records.</p>
                                
                                {marks?.subject_attendance < 75 && (
                                    <div className="mt-4 p-2 bg-red-50 border border-red-200 rounded text-red-600 text-xs font-bold uppercase">
                                        ⚠️ Warning: Below 75% Requirement
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}