'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { API_URL } from '@/config';
import axios from 'axios';
import peekImage from "@/public/peek.jpg";

interface Announcement {
  id: number;
  title: string;
  content: string;
  type: string;
}

const heroImages = [
  '/college-bg-1.jpg',
  '/college-bg-2.jpg',
  '/college-bg-3.jpg',
];

export default function Home() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [currentBg, setCurrentBg] = useState(0);

  // 🔹 Background slideshow
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBg((prev) => (prev + 1) % heroImages.length);
    }, 5000); // change every 5 seconds

    return () => clearInterval(interval);
  }, []);

  // 🔹 Fetch announcements
  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const res = await axios.get(`${API_URL}/announcements?type=Global`);
        setAnnouncements(res.data);
      } catch (error) {
        console.error("Failed to fetch announcements", error);
      }
    };
    fetchAnnouncements();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <main className="flex-grow">

        {/* 🔹 HERO SECTION WITH SLIDESHOW */}
        <section className="relative text-white py-24 overflow-hidden">

          {/* Background images */}
          {heroImages.map((img, index) => (
            <div
              key={img}
              className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ${index === currentBg ? 'opacity-100' : 'opacity-0'
                }`}
              style={{ backgroundImage: `url('${img}')` }}
            />
          ))}

          {/* Same blue overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/40 to-blue-700/40"></div>
          {/* Content */}
          <div className="relative container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Vel Tech High Tech
            </h1>
            <p className="text-xl md:text-2xl mb-8 font-light">
              Dr. Rangarajan Dr. Sakunthala Engineering College
            </p>

            <Link href="/login">
              <button className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-8 rounded-full transition duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                Department of Artificial Intelligence & Data Science
              </button>
            </Link>
          </div>
        </section>

        {/* ANNOUNCEMENTS */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12 text-blue-900">
              Announcements
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {announcements.length > 0 ? (
                announcements.map((ann) => (
                  <div
                    key={ann.id}
                    className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300 border-l-4 border-blue-500"
                  >
                    <h3 className="font-bold text-xl mb-2 text-gray-800">
                      {ann.title}
                    </h3>
                    <p className="text-gray-600">{ann.content}</p>
                  </div>
                ))
              ) : (
                <div className="col-span-3 text-center text-gray-500">
                  No announcements at the moment.
                </div>
              )}
            </div>
          </div>
        </section>

        {/* ABOUT */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-8 text-blue-900">
              About Our College
            </h2>
            <p className="text-gray-700 max-w-4xl mx-auto text-center leading-relaxed">
              Vel Tech High Tech Dr.RangarajanDr.Sakunthala Engineering College
              established in the year 2002...
            </p>

            <div className="flex justify-center mt-8">
              <img
                src={peekImage.src}
                alt="Vel Tech High Tech College View"
                className="rounded-lg shadow-lg max-w-full h-auto"
              />
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}