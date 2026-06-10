"use client";
import React, { useState, useEffect } from 'react';

export default function AdminPage() {
  const [password, setPassword] = useState('');
  const [profiles, setProfiles] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
  const [form, setForm] = useState({ name: '', age: '', city: '', bio: '', whatsapp: '', telegram: '' });
  const [message, setMessage] = useState('');

  const load = () => fetch('/api/profiles').then(r => r.json()).then(setProfiles);
  useEffect(() => { load(); }, []);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => fd.append(k, v));
    fd.append('password', password);
    if (selectedFiles) Array.from(selectedFiles).forEach(f => fd.append('photos', f));

    const res = await fetch('/api/profiles', { method: 'POST', body: fd });
    if (res.ok) {
      setMessage('Profil eklendi!');
      setForm({ name: '', age: '', city: '', bio: '', whatsapp: '', telegram: '' });
      setSelectedFiles(null);
      load();
    } else {
      setMessage('Hata! Sifre yanlis olabilir.');
    }
  };

  const del = async (id: string) => {
    if (confirm("Bu profil silinsin mi?")) {
      await fetch("/api/profiles?id=" + id + "&password=" + password, { method: 'DELETE' });
      load();
    }
  };

  return (
    <main className="min-h-screen bg-slate-100 p-8 text-slate-900">
      <div className="max-w-4xl mx-auto space-y-6">

        <h1 className="text-3xl font-black text-slate-800">Admin Paneli</h1>

        <div className="bg-white p-6 rounded-2xl shadow-lg space-y-3">
          <h2 className="text-xl font-bold">Admin Sifresi</h2>
          <input
            type="password"
            placeholder="Sifrenizi girin"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full p-3 border rounded-xl"
          />
        </div>

        <form onSubmit={save} className="bg-white p-6 rounded-2xl shadow-lg space-y-3">
          <h2 className="text-xl font-bold">Yeni Profil Ekle</h2>
          {message && <p className="text-sm font-bold">{message}</p>}
          <input placeholder="Isim" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required className="w-full p-3 border rounded-xl" />
          <input placeholder="Yas" value={form.age} onChange={e => setForm({...form, age: e.target.value})} required className="w-full p-3 border rounded-xl" />
          <input placeholder="Sehir" value={form.city} onChange={e => setForm({...form, city: e.target.value})} required className="w-full p-3 border rounded-xl" />
          <textarea placeholder="Bio" value={form.bio} onChange={e => setForm({...form, bio: e.target.value})} required className="w-full p-3 border rounded-xl" />
          <input placeholder="WhatsApp (ornek: 905551234567)" value={form.whatsapp} onChange={e => setForm({...form, whatsapp: e.target.value})} required className="w-full p-3 border rounded-xl" />
          <input placeholder="Telegram (ornek: kullaniciadi)" value={form.telegram} onChange={e => setForm({...form, telegram: e.target.value})} required className="w-full p-3 border rounded-xl" />
          <input type="file" multiple accept="image/*" onChange={e => setSelectedFiles(e.target.files)} className="w-full p-3 border rounded-xl" />
          <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-bold">
            Profil Ekle
          </button>
        </form>

        <div className="bg-white p-6 rounded-2xl shadow-lg">
          <h2 className="text-xl font-bold mb-4">Mevcut Profiller</h2>
          {profiles.length === 0 && <p className="text-slate-400">Henuz profil yok.</p>}
          {profiles.map((p: any) => (
            <div key={p._id} className="flex justify-between items-center border-b py-3">
              <span className="font-medium">{p.name} - {p.city} ({p.photos?.length || 0} Foto)</span>
              <button onClick={() => del(p._id)} className="text-red-500 font-bold hover:text-red-700">SIL</button>
            </div>
          ))}
        </div>

      </div>
    </main>
  );
}