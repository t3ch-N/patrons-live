'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase';

export default function DynamicLeaderboard({ tournamentId }) {
  const [settings, setSettings] = useState(null);
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(true);

  const supabase = createClient();

  useEffect(() => {
    loadData();
  }, [tournamentId]);

  const loadData = async () => {
    // Load tournament settings
    const { data: settingsData } = await supabase
      .from('tournament_settings')
      .select('*')
      .eq('tournament_id', tournamentId)
      .single();

    setSettings(settingsData);

    // Load scores
    const { data: scoresData } = await supabase
      .from('scores')
      .select('*, team:teams(*)')
      .eq('tournament_id', tournamentId)
      .order('points', { ascending: false });

    setScores(scoresData || []);
    setLoading(false);
  };

  if (loading) return <div>Loading...</div>;
  if (!settings) return <div>No settings found</div>;

  // Group by division if enabled
  const groupedScores = settings.show_divisions_separately && settings.has_divisions
    ? scores.reduce((acc, score) => {
        const div = score.team.division || 'A';
        if (!acc[div]) acc[div] = [];
        acc[div].push(score);
        return acc;
      }, {})
    : { All: scores };

  return (
    <div className="space-y-8">
      {Object.entries(groupedScores).map(([division, divScores]) => (
        <div key={division}>
          {settings.show_divisions_separately && settings.has_divisions && (
            <h2 className="text-2xl font-bold mb-4">Division {division}</h2>
          )}
          
          <div className="overflow-x-auto">
            <table className="w-full bg-white rounded shadow">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-3 text-left">Pos</th>
                  <th className="p-3 text-left">Team</th>
                  <th className="p-3 text-center">Points</th>
                  <th className="p-3 text-center">Played</th>
                  <th className="p-3 text-center">Won</th>
                  <th className="p-3 text-center">Drawn</th>
                  <th className="p-3 text-center">Lost</th>
                  {settings.show_holes_won && <th className="p-3 text-center">Holes Won</th>}
                  {settings.show_strokes_differential && <th className="p-3 text-center">Strokes +/-</th>}
                </tr>
              </thead>
              <tbody>
                {divScores.map((score, idx) => (
                  <tr key={score.id} className="border-t hover:bg-gray-50">
                    <td className="p-3 font-bold">{idx + 1}</td>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: score.team.color }} />
                        {score.team.name}
                      </div>
                    </td>
                    <td className="p-3 text-center font-bold">{score.points}</td>
                    <td className="p-3 text-center">{score.matches_played}</td>
                    <td className="p-3 text-center">{score.matches_won}</td>
                    <td className="p-3 text-center">{score.matches_halved}</td>
                    <td className="p-3 text-center">{score.matches_lost}</td>
                    {settings.show_holes_won && (
                      <td className="p-3 text-center">{score.holes_won}</td>
                    )}
                    {settings.show_strokes_differential && (
                      <td className={`p-3 text-center ${score.strokes_differential > 0 ? 'text-green-600' : score.strokes_differential < 0 ? 'text-red-600' : ''}`}>
                        {score.strokes_differential > 0 ? '+' : ''}{score.strokes_differential}
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  );
}
