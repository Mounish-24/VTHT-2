'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';
import { API_URL } from '@/config';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Book, Megaphone, CheckCircle, ArrowLeft, Download } from 'lucide-react';

export default function LabDetails() {
    const params = useParams();
    const router = useRouter();
    const [manuals, setManuals] = useState<any[]>([]);
    const [announcements, setAnnouncements] = useState<any[]>([]);
    const [attendance, setAttendance] = useState(0);

    useEffect(() => {
        const fetchLabData = async () => {
            const userId = localStorage.getItem('user_id');
            try {
                // 1. Fetch Manuals (Filtered by type "Lab Manual")
                const matRes = await axios.get(`${API_URL}/materials/${params.id}`);
                setManuals(matRes.data.filter((m: any) => m.type === "Lab Manual"));

                // 2. Fetch Lab-Specific Announcements
                const annRes = await axios.get(`${API_URL}/announcements?course_code=${params.id}`);
                setAnnouncements(annRes.data);

                // 3. Fetch Lab Attendance
                const attRes = await axios.get(`${API_URL}/marks/cia?student_id=${userId}`);
                const currentLab = attRes.data.find((l: any) => l.subject === params.id);
                setAttendance(currentLab?.subject_attendance || 0);
            } catch (err) { console.error("Error loading lab data"); }
        };
        fetchLabData();
    }, [params.id]);

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <Navbar />
            <div className="container mx-auto px-4 py-8 flex-grow">
                <button onClick={() => router.back()} className="flex items-center gap-2 text-blue-900 font-bold mb-6">
                    <ArrowLeft size={20} /> Back to Dashboard
                </button>

                <h1 className="text-3xl font-bold text-blue-900 mb-8">Laboratory: {params.id}</h1>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Section 1: Lab Manuals */}
                    <div className="bg-white p-6 rounded-xl shadow-md border-t-4 border-purple-600">
                        <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><Book className="text-purple-600" /> Lab Manuals</h2>
                        {manuals.length > 0 ? manuals.map(m => (
                            <div key={m.id} className="flex justify-between items-center p-3 bg-gray-50 rounded mb-2 border">
                                <span className="font-medium text-sm">{m.title}</span>
                                <Download size={18} className="text-blue-900 cursor-pointer" />
                            </div>
                        )) : <p className="text-gray-400 text-sm">No manuals uploaded yet.</p>}
                    </div>

                    {/* Section 2: Lab Announcements */}
                    <div className="bg-white p-6 rounded-xl shadow-md border-t-4 border-orange-500">
                        <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><Megaphone className="text-orange-500" /> Lab Notices</h2>
                        {announcements.map(a => (
                            <div key={a.id} className="mb-4 border-b pb-2">
                                <h4 className="font-bold text-blue-900">{a.title}</h4>
                                <p className="text-sm text-gray-600">{a.content}</p>
                            </div>
                        ))}
                    </div>

                    {/* Section 3: Attendance */}
                    <div className="bg-white p-6 rounded-xl shadow-md border-t-4 border-green-500 text-center">
                        <h2 className="text-xl font-bold mb-4 flex items-center justify-center gap-2"><CheckCircle className="text-green-500" /> Attendance</h2>
                        <div className="text-5xl font-bold text-blue-900 mb-2">{attendance}%</div>
                        <p className={`text-sm font-bold ${attendance < 75 ? 'text-red-500' : 'text-green-600'}`}>
                            {attendance < 75 ? 'Warning: Low Attendance' : 'Status: Good'}
                        </p>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}