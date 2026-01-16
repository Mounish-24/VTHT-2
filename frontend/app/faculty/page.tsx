'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { API_URL } from '@/config';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { BookOpen, Users, ChevronRight, Megaphone } from 'lucide-react';

export default function FacultyDashboard() {
    const [faculty, setFaculty] = useState<any>(null);
    const [myCourses, setMyCourses] = useState<any[]>([]);
    const [announcement, setAnnouncement] = useState({ title: '', content: '' });
    const [message, setMessage] = useState('');
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem('token');
        const role = localStorage.getItem('role');
        const userId = localStorage.getItem('user_id');

        // Security Check
        if (!token || (role !== 'Faculty' && role !== 'HOD')) {
            router.push('/login');
            return;
        }

        const fetchData = async () => {
            try {
                // 1. Fetch real faculty profile from our new API
                const res = await axios.get(`${API_URL}/faculty/${userId}`);
                setFaculty(res.data);

                // 2. Mocking courses (In real apps, fetch from /api/faculty/courses)
                setMyCourses([
                    { id: 1, code: "CS3401", title: "Artificial Intelligence", sections: ["A", "B"] },
                    { id: 2, code: "MA3151", title: "Matrices & Calculus", sections: ["A"] }
                ]);
            } catch (error) {
                console.error("Error loading profile:", error);
            }
        };
        fetchData();
    }, [router]);

    const handlePostAnnouncement = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const userId = localStorage.getItem('user_id');

            // CHANGE THIS PAYLOAD
            const payload = {
                title: announcement.title,
                content: announcement.content,
                type: "Department",       // Must be "Department" to show on student home
                posted_by: userId,        // Matches your models.py
                course_code: "Global"     // "Global" identifies it as a general Dept notice
            };

            await axios.post(`${API_URL}/announcements`, payload);

            setMessage("Broadcasted to Department Successfully!");
            setAnnouncement({ title: '', content: '' });
        } catch (err) {
            console.error("Post Error:", err);
            setMessage("Failed to post: Check backend terminal.");
        }
    };

    if (!faculty) return <div className="min-h-screen flex items-center justify-center font-bold text-blue-900">Loading Staff Portal...</div>;

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <Navbar />
            <div className="container mx-auto px-4 py-8 flex-grow">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-blue-900">Faculty Dashboard</h1>
                    <span className="bg-blue-100 text-blue-800 px-4 py-1 rounded-full font-semibold">
                        {faculty.designation}
                    </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* LEFT COLUMN: Profile Card */}
                    <div className="bg-white p-6 rounded-lg shadow-md h-fit border-t-4 border-blue-900">
                        <div className="flex flex-col items-center mb-4">
                            <div className="w-24 h-24 bg-blue-900 rounded-full flex items-center justify-center text-white text-3xl font-bold mb-4">
                                {faculty.name.charAt(0)}
                            </div>
                            <h2 className="text-xl font-bold text-blue-900 text-center">{faculty.name}</h2>
                        </div>
                        <div className="space-y-3 text-sm border-t pt-4">
                            <p className="flex justify-between"><span className="text-gray-500">Staff ID:</span> <span className="font-mono font-bold">{faculty.staff_no}</span></p>
                            <p className="flex justify-between"><span className="text-gray-500">Status:</span> <span className="text-green-600 font-bold">Active</span></p>
                            <p className="flex justify-between"><span className="text-gray-500">Dept:</span> <span className="font-bold">AI & DS</span></p>
                        </div>
                    </div>

                    {/* RIGHT COLUMN: Main Actions */}
                    <div className="md:col-span-2 space-y-6">
                        {/* Course Management Section */}
                        <div className="bg-white p-8 rounded-lg shadow-md border-l-4 border-orange-500">
                            <h2 className="text-2xl font-bold mb-2 text-blue-900 flex items-center gap-2">
                                <BookOpen className="text-orange-500" /> Academic Management
                            </h2>
                            <p className="text-gray-600 mb-6">Select a course section to manage marks and attendance.</p>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {myCourses.map((course) => (
                                    <div key={course.id} className="border rounded-lg p-5 hover:border-blue-500 transition-all bg-gray-50">
                                        <h3 className="font-bold text-lg text-blue-900">{course.code}</h3>
                                        <p className="text-sm text-gray-500 mb-4">{course.title}</p>

                                        <div className="space-y-2">
                                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Select Section</p>
                                            <div className="flex flex-wrap gap-2">
                                                {course.sections.map((sec: string) => (
                                                    <button
                                                        key={sec}
                                                        onClick={() => router.push(`/faculty/manage/${course.code}/${sec}`)}
                                                        className="bg-blue-900 text-white px-4 py-2 rounded shadow-sm hover:bg-orange-500 transition-colors flex items-center gap-2 text-sm"
                                                    >
                                                        Section {sec} <ChevronRight size={14} />
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Announcement Form */}
                        <div className="bg-white p-6 rounded-lg shadow-md">
                            <h2 className="text-xl font-bold mb-4 text-blue-900 flex items-center gap-2">
                                <Megaphone className="text-orange-500" /> Post Department Announcement
                            </h2>
                            {message && <p className="mb-4 p-2 bg-green-100 text-green-700 rounded text-sm text-center">{message}</p>}
                            <form onSubmit={handlePostAnnouncement} className="space-y-4">
                                <input
                                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
                                    placeholder="Title (e.g., CIA-1 Postponed)"
                                    value={announcement.title}
                                    onChange={(e) => setAnnouncement({ ...announcement, title: e.target.value })}
                                    required
                                />
                                <textarea
                                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none h-24"
                                    placeholder="Details..."
                                    value={announcement.content}
                                    onChange={(e) => setAnnouncement({ ...announcement, content: e.target.value })}
                                    required
                                />
                                <button type="submit" className="w-full bg-orange-500 text-white font-bold py-2 rounded hover:bg-orange-600 transition">
                                    Broadcast to Students
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}

