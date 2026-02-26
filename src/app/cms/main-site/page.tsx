'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase';
import Link from 'next/link';

// Force dynamic rendering
export const dynamic = 'force-dynamic';
export const runtime = 'edge';

export default function MainHubCMS() {
  const [content, setContent] = useState({
    hero_title: 'MyGolfHub Africa',
    hero_subtitle: 'Your home for golf tournaments in Kenya',
    about_text: ''
  });
  const [tournaments, setTournaments] = useState([]);
  const [loading, setLoading] = useState(false);

  const supabase = createClient();

  useEffect(() => {
    loadContent();
    loadTournaments();
  }, []);

  const loadContent = async () => {
    const { data } = await supabase.from('site_content').select('*').single();
    if (data) setContent(data);
  };

  const loadTournaments = async () => {
    const { data } = await supabase.from('tournaments').select('*').order('start_date', { ascending: false });
    setTournaments(data || []);
  };

  const saveContent = async () => {
    setLoading(true);
    await supabase.from('site_content').upsert([content]);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Main Website CMS</h1>

        <div className="bg-white p-6 rounded shadow mb-6">
          <h2 className="text-2xl font-bold mb-4">Hero Section</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Hero Title</label>
              <input type="text" value={content.hero_title} onChange={(e) => setContent({ ...content, hero_title: e.target.value })} className="border p-2 rounded w-full" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Hero Subtitle</label>
              <input type="text" value={content.hero_subtitle} onChange={(e) => setContent({ ...content, hero_subtitle: e.target.value })} className="border p-2 rounded w-full" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">About Text</label>
              <textarea value={content.about_text} onChange={(e) => setContent({ ...content, about_text: e.target.value })} className="border p-2 rounded w-full" rows="4" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded shadow mb-6">
          <h2 className="text-2xl font-bold mb-4">Active Tournaments</h2>
          <div className="grid gap-4">
            {tournaments.map((t) => (
              <div key={t.id} className="border p-4 rounded flex justify-between items-center">
                <div>
                  <h3 className="font-bold">{t.name}</h3>
                  <p className="text-sm text-gray-600">{t.start_date} to {t.end_date}</p>
                  <span className={`inline-block px-2 py-1 rounded text-xs mt-2 ${t.status === 'active' ? 'bg-green-100 text-green-800' : t.status === 'upcoming' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'}`}>
                    {t.status}
                  </span>
                </div>
                <Link href={`/tournaments/${t.slug}`} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                  View
                </Link>
              </div>
            ))}
          </div>
        </div>

        <button onClick={saveContent} disabled={loading} className="bg-green-600 text-white px-6 py-3 rounded hover:bg-green-700 disabled:bg-gray-400">
          {loading ? 'Saving...' : 'Save Changes'}
        </button>

        <div className="mt-8 p-6 bg-blue-50 rounded">
          <h3 className="font-bold mb-2">Preview URL</h3>
          <p className="text-sm text-gray-600">Your main website will be at:</p>
          <a href="https://www.mygolfhub.africa" target="_blank" className="text-blue-600 hover:underline">https://www.mygolfhub.africa</a>
        </div>
      </div>
    </div>
  );
}
