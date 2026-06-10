"use client";
import React, { useEffect, useState } from 'react';

const ProfileCard = ({ profile }: { profile: any }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const photos = profile.photos || [];

const handleImageClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (photos.length <= 1) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    if (x > rect.width / 2) {
      setCurrentIndex((prev) => (prev + 1) % photos.length);
    } else {
      setCurrentIndex((prev) => (prev - 1 + photos.length) % photos.length);
    }
  };

  return (
    <div className="group bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col transition-all duration-500 hover:scale-[1.02]">
      <div className="relative aspect-[4/5] w-full overflow-hidden cursor-pointer" onClick={handleImageClick}>
        <img
          src={photos[currentIndex] || "https://via.placeholder.com/400x500"}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          alt="Discovery Profile"
        />
        <div className="absolute top-5 right-5 bg-white/20 dark:bg-black/20 backdrop-blur-md border border-white/30 px-3 py-1 rounded-full text-[10px] font-bold text-white uppercase tracking-widest">
          Aktif
        </div>
        {photos.length > 1 && (
          <div className="absolute bottom-5 inset-x-0 flex justify-center gap-1.5 px-10">
{photos.map((_: any, i: number) => (
              <div
                key={i}
                className={"h-1 rounded-full transition-all duration-300 " + (i === currentIndex ? "w-8 bg-white" : "w-2 bg-white/40")}
              />
            ))}
          </div>
        )}
      </div>

      <div className="p-8 flex flex-col items-center text-center space-y-4">
        <div>
          <h2 className="text-3xl font-black text-slate-800 dark:text-slate-100 tracking-tight">
            {profile.name} <span className="text-indigo-500 font-light">/ {profile.age}</span>
          </h2>
          <p className="text-sm font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-[0.2em] mt-1">
            {profile.city}
          </p>
        </div>
        <p className="text-slate-500 dark:text-slate-400 italic text-sm leading-relaxed line-clamp-3">
          {profile.bio}
        </p>
        <div className="w-full grid grid-cols-2 gap-3 pt-4">
          <a href={"https://wa.me/" + profile.whatsapp} target="_blank" className="flex items-center justify-center bg-emerald-500 hover:bg-emerald-600 text-white py-4 rounded-2xl font-bold transition-all">
            WhatsApp
          </a>
          <a href={"https://t.me/" + profile.telegram} target="_blank" className="flex items-center justify-center bg-sky-500 hover:bg-sky-600 text-white py-4 rounded-2xl font-bold transition-all">
            Telegram
          </a>
        </div>
      </div>
    </div>
  );
};

export default function Home() {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/profiles')
      .then(r => r.json())
      .then(data => {
        setProfiles(data);
        setLoading(false);
      });
  }, []);

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 p-6 md:p-16">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-20 space-y-4">
          <h1 className="text-6xl md:text-8xl font-black text-slate-900 dark:text-white tracking-tighter uppercase">
            Discovery<span className="text-indigo-600">.</span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium tracking-[0.3em] uppercase text-[10px]">
            Premium Tanisma Katalogu - {profiles.length} Aktif Profil
          </p>
          <div className="h-1 w-20 bg-indigo-600 mx-auto rounded-full mt-6"></div>
        </header>

        {loading ? (
          <div className="flex justify-center items-center h-64 text-indigo-600 font-bold tracking-widest uppercase text-xs animate-pulse">
            Sistem Yukleniyor...
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {profiles.map((p: any) => (
             <ProfileCard key={(p as any)._id} profile={p} />
            ))}
            {profiles.length === 0 && (
              <div className="col-span-full text-center py-32 bg-white dark:bg-slate-900 rounded-[3rem] border border-slate-200 dark:border-slate-800">
                <p className="text-slate-400 dark:text-slate-600 font-bold uppercase tracking-[0.2em] text-sm">
                  Henuz kimse kesferilmedi
                </p>
              </div>
            )}
          </div>
        )}

        <footer className="mt-32 text-center text-slate-400 dark:text-slate-600 text-[10px] font-bold tracking-[0.5em] uppercase">
          2026 BY EXPOWER - INTERGALACTIC DIVISION
        </footer>
      </div>
    </main>
  );
}