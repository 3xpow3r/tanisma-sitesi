"use client";
import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

export default function ProfilePage() {
  const params = useParams();
  const router = useRouter();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    fetch('/api/profiles')
      .then(r => r.json())
      .then(data => {
        const found = data.find((p: any) => p._id === params.id);
        setProfile(found || null);
        setLoading(false);
      });
  }, [params.id]);

  const handleImageClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!profile || profile.photos.length <= 1) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    if (x > rect.width / 2) {
      setCurrentIndex((prev) => (prev + 1) % profile.photos.length);
    } else {
      setCurrentIndex((prev) => (prev - 1 + profile.photos.length) % profile.photos.length);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
      <p className="text-indigo-600 font-bold tracking-widest uppercase text-xs animate-pulse">Yukleniyor...</p>
    </div>
  );

  if (!profile) return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
      <p className="text-slate-400 font-bold">Profil bulunamadi.</p>
    </div>
  );

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 p-6 md:p-16">
      <div className="max-w-2xl mx-auto">
        <button
          onClick={() => router.back()}
          className="mb-8 text-indigo-600 font-bold uppercase tracking-widest text-xs hover:text-indigo-800 transition-colors"
        >
          ← Geri Don
        </button>

        <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
          <div
            className="relative aspect-[4/5] w-full overflow-hidden cursor-pointer"
            onClick={handleImageClick}
          >
            <img
              src={profile.photos[currentIndex] || "https://via.placeholder.com/400x500"}
              className="w-full h-full object-cover"
              alt={profile.name}
            />
            <div className="absolute top-5 right-5 bg-white/20 dark:bg-black/20 backdrop-blur-md border border-white/30 px-3 py-1 rounded-full text-[10px] font-bold text-white uppercase tracking-widest">
              Aktif
            </div>
            {profile.photos.length > 1 && (
              <div className="absolute bottom-5 inset-x-0 flex justify-center gap-1.5 px-10">
                {profile.photos.map((_: any, i: number) => (
                  <div
                    key={i}
                    className={"h-1 rounded-full transition-all duration-300 " + (i === currentIndex ? "w-8 bg-white" : "w-2 bg-white/40")}
                  />
                ))}
              </div>
            )}
          </div>

          <div className="p-8 space-y-6">
            <div className="text-center">
              <h1 className="text-4xl font-black text-slate-800 dark:text-slate-100 tracking-tight">
                {profile.name} <span className="text-indigo-500 font-light">/ {profile.age}</span>
              </h1>
              <p className="text-sm font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-[0.2em] mt-2">
                {profile.city}
              </p>
            </div>

            <p className="text-slate-500 dark:text-slate-400 italic text-base leading-relaxed text-center">
              {profile.bio}
            </p>

            <div className="grid grid-cols-2 gap-4">
              
                href={"https://wa.me/" + profile.whatsapp}
                target="_blank"
                className="flex items-center justify-center bg-emerald-500 hover:bg-emerald-600 text-white py-4 rounded-2xl font-bold transition-all shadow-lg shadow-emerald-500/20 text-lg"
              >
                WhatsApp
              </a>
              
                href={"https://t.me/" + profile.telegram}
                target="_blank"
                className="flex items-center justify-center bg-sky-500 hover:bg-sky-600 text-white py-4 rounded-2xl font-bold transition-all shadow-lg shadow-sky-500/20 text-lg"
              >
                Telegram
              </a>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}