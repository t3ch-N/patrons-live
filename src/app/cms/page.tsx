'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase';

// Force dynamic rendering
export const dynamic = 'force-dynamic';
export const runtime = 'edge';

export default function TournamentCMS() {
  const [tournaments, setTournaments] = useState([]);
  const [selectedTournament, setSelectedTournament] = useState(null);
  const [activeTab, setActiveTab] = useState('tournaments');

  const supabase = createClient();

  useEffect(() => {
    loadTournaments();
  }, []);

  const loadTournaments = async () => {
    const { data } = await supabase.from('tournaments').select('*').order('start_date', { ascending: false });
    setTournaments(data || []);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Tournament Management CMS</h1>

        <div className="flex gap-4 mb-6 border-b">
          <button onClick={() => setActiveTab('tournaments')} className={`px-4 py-2 ${activeTab === 'tournaments' ? 'border-b-2 border-blue-600 font-semibold' : ''}`}>Tournaments</button>
          <button onClick={() => setActiveTab('matches')} className={`px-4 py-2 ${activeTab === 'matches' ? 'border-b-2 border-blue-600 font-semibold' : ''}`}>Matches</button>
          <button onClick={() => setActiveTab('teams')} className={`px-4 py-2 ${activeTab === 'teams' ? 'border-b-2 border-blue-600 font-semibold' : ''}`}>Teams</button>
        </div>

        {activeTab === 'tournaments' && <TournamentManager tournaments={tournaments} onUpdate={loadTournaments} />}
        {activeTab === 'matches' && <MatchManager />}
        {activeTab === 'teams' && <TeamManager />}
      </div>
    </div>
  );
}

function TournamentManager({ tournaments, onUpdate }) {
  const [showForm, setShowForm] = useState(false);
  const [showSettings, setShowSettings] = useState(null);
  const [formData, setFormData] = useState({ name: '', slug: '', description: '', start_date: '', end_date: '', format: 'patrons_cup', status: 'upcoming' });
  const [settings, setSettings] = useState({
    has_divisions: true,
    divisions: ['A', 'B'],
    num_teams: 12,
    points_for_win: 2,
    points_for_draw: 1,
    points_for_loss: 0,
    total_rounds: 3,
    sessions_per_round: 2,
    show_divisions_separately: true,
    show_holes_won: true,
    show_strokes_differential: true
  });
  const supabase = createClient();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { data: tournament } = await supabase.from('tournaments').insert([formData]).select().single();
    if (tournament) {
      await supabase.from('tournament_settings').insert([{ tournament_id: tournament.id, ...settings }]);
    }
    setShowForm(false);
    onUpdate();
  };

  const saveSettings = async (tournamentId) => {
    await supabase.from('tournament_settings').upsert([{ tournament_id: tournamentId, ...settings }]);
    setShowSettings(null);
  };

  const updateStatus = async (id, status) => {
    await supabase.from('tournaments').update({ status }).eq('id', id);
    onUpdate();
  };

  return (
    <div>
      <div className="flex justify-between mb-6">
        <h2 className="text-2xl font-bold">Tournaments</h2>
        <button onClick={() => setShowForm(!showForm)} className="bg-blue-600 text-white px-4 py-2 rounded">{showForm ? 'Cancel' : '+ New'}</button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow mb-6">
          <h3 className="font-bold mb-4">Basic Info</h3>
          <div className="grid grid-cols-2 gap-4">
            <input type="text" placeholder="Name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="border p-2 rounded" required />
            <input type="text" placeholder="Slug" value={formData.slug} onChange={(e) => setFormData({ ...formData, slug: e.target.value })} className="border p-2 rounded" required />
            <input type="date" value={formData.start_date} onChange={(e) => setFormData({ ...formData, start_date: e.target.value })} className="border p-2 rounded" required />
            <input type="date" value={formData.end_date} onChange={(e) => setFormData({ ...formData, end_date: e.target.value })} className="border p-2 rounded" required />
            <select value={formData.format} onChange={(e) => setFormData({ ...formData, format: e.target.value })} className="border p-2 rounded">
              <option value="patrons_cup">Patrons Cup</option>
              <option value="stableford">Stableford</option>
              <option value="stroke_play">Stroke Play</option>
            </select>
          </div>
          <textarea placeholder="Description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="border p-2 rounded w-full mt-4" rows="3" />
          
          <h3 className="font-bold mt-6 mb-4">Tournament Settings</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={settings.has_divisions} onChange={(e) => setSettings({ ...settings, has_divisions: e.target.checked })} />
                <span>Has Divisions</span>
              </label>
            </div>
            <input type="number" placeholder="Number of Teams" value={settings.num_teams} onChange={(e) => setSettings({ ...settings, num_teams: parseInt(e.target.value) })} className="border p-2 rounded" />
            <input type="number" step="0.5" placeholder="Points for Win" value={settings.points_for_win} onChange={(e) => setSettings({ ...settings, points_for_win: parseFloat(e.target.value) })} className="border p-2 rounded" />
            <input type="number" step="0.5" placeholder="Points for Draw" value={settings.points_for_draw} onChange={(e) => setSettings({ ...settings, points_for_draw: parseFloat(e.target.value) })} className="border p-2 rounded" />
            <input type="number" placeholder="Total Rounds" value={settings.total_rounds} onChange={(e) => setSettings({ ...settings, total_rounds: parseInt(e.target.value) })} className="border p-2 rounded" />
            <input type="number" placeholder="Sessions per Round" value={settings.sessions_per_round} onChange={(e) => setSettings({ ...settings, sessions_per_round: parseInt(e.target.value) })} className="border p-2 rounded" />
          </div>
          
          <h3 className="font-bold mt-6 mb-4">Standings Display</h3>
          <div className="space-y-2">
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={settings.show_divisions_separately} onChange={(e) => setSettings({ ...settings, show_divisions_separately: e.target.checked })} />
              <span>Show Divisions Separately</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={settings.show_holes_won} onChange={(e) => setSettings({ ...settings, show_holes_won: e.target.checked })} />
              <span>Show Holes Won</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={settings.show_strokes_differential} onChange={(e) => setSettings({ ...settings, show_strokes_differential: e.target.checked })} />
              <span>Show Strokes Differential</span>
            </label>
          </div>
          
          <button type="submit" className="bg-green-600 text-white px-6 py-2 rounded mt-6">Create Tournament</button>
        </form>
      )}

      <div className="grid gap-4">
        {tournaments.map((t) => (
          <div key={t.id} className="bg-white p-6 rounded shadow">
            <div className="flex justify-between">
              <div>
                <h3 className="text-xl font-bold">{t.name}</h3>
                <p className="text-gray-600">{t.slug}</p>
                <p className="text-sm text-gray-500">{t.start_date} to {t.end_date}</p>
              </div>
              <div className="flex gap-2 items-center">
                <button onClick={() => setShowSettings(t.id)} className="text-blue-600 hover:underline text-sm">Settings</button>
                <button onClick={() => updateStatus(t.id, 'upcoming')} className={`px-3 py-1 rounded text-sm ${t.status === 'upcoming' ? 'bg-yellow-600 text-white' : 'bg-gray-200'}`}>Upcoming</button>
                <button onClick={() => updateStatus(t.id, 'active')} className={`px-3 py-1 rounded text-sm ${t.status === 'active' ? 'bg-green-600 text-white' : 'bg-gray-200'}`}>Active</button>
                <button onClick={() => updateStatus(t.id, 'completed')} className={`px-3 py-1 rounded text-sm ${t.status === 'completed' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>Completed</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function MatchManager() {
  const [matches, setMatches] = useState([]);
  const [teams, setTeams] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ tournament_id: 1, round: 1, session: 'morning', match_type: 'fourballs', team1_id: '', team2_id: '', scheduled_time: '' });
  const supabase = createClient();

  useEffect(() => {
    loadMatches();
    loadTeams();
  }, []);

  const loadMatches = async () => {
    const { data } = await supabase.from('matches').select('*, team1:teams!team1_id(*), team2:teams!team2_id(*)').order('scheduled_time');
    setMatches(data || []);
  };

  const loadTeams = async () => {
    const { data } = await supabase.from('teams').select('*');
    setTeams(data || []);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await supabase.from('matches').insert([formData]);
    setShowForm(false);
    loadMatches();
  };

  return (
    <div>
      <div className="flex justify-between mb-6">
        <h2 className="text-2xl font-bold">Matches</h2>
        <button onClick={() => setShowForm(!showForm)} className="bg-blue-600 text-white px-4 py-2 rounded">{showForm ? 'Cancel' : '+ New'}</button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow mb-6">
          <div className="grid grid-cols-2 gap-4">
            <input type="number" placeholder="Round" value={formData.round} onChange={(e) => setFormData({ ...formData, round: parseInt(e.target.value) })} className="border p-2 rounded" required />
            <select value={formData.session} onChange={(e) => setFormData({ ...formData, session: e.target.value })} className="border p-2 rounded">
              <option value="morning">Morning</option>
              <option value="afternoon">Afternoon</option>
            </select>
            <select value={formData.match_type} onChange={(e) => setFormData({ ...formData, match_type: e.target.value })} className="border p-2 rounded">
              <option value="fourballs">Four Balls</option>
              <option value="foursomes">Foursomes</option>
              <option value="singles">Singles</option>
            </select>
            <input type="datetime-local" value={formData.scheduled_time} onChange={(e) => setFormData({ ...formData, scheduled_time: e.target.value })} className="border p-2 rounded" required />
            <select value={formData.team1_id} onChange={(e) => setFormData({ ...formData, team1_id: parseInt(e.target.value) })} className="border p-2 rounded" required>
              <option value="">Team 1</option>
              {teams.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
            <select value={formData.team2_id} onChange={(e) => setFormData({ ...formData, team2_id: parseInt(e.target.value) })} className="border p-2 rounded" required>
              <option value="">Team 2</option>
              {teams.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
          </div>
          <button type="submit" className="bg-green-600 text-white px-6 py-2 rounded mt-4">Create</button>
        </form>
      )}

      <div className="grid gap-4">
        {matches.map((m) => (
          <div key={m.id} className="bg-white p-4 rounded shadow">
            <div className="flex justify-between">
              <div>
                <p className="font-semibold">Round {m.round} - {m.session}</p>
                <p className="text-sm">{m.team1?.name} vs {m.team2?.name}</p>
              </div>
              <span className={`px-2 py-1 rounded text-xs ${m.status === 'completed' ? 'bg-green-100' : 'bg-yellow-100'}`}>{m.status}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function TeamManager() {
  const [teams, setTeams] = useState([]);
  const [players, setPlayers] = useState([]);
  const [teamPlayers, setTeamPlayers] = useState({});
  const [showForm, setShowForm] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [selectedPlayer, setSelectedPlayer] = useState('');
  const [formData, setFormData] = useState({ tournament_id: 1, name: '', division: 'A', color: '#000000' });
  const supabase = createClient();

  useEffect(() => {
    loadTeams();
    loadPlayers();
  }, []);

  const loadTeams = async () => {
    const { data } = await supabase.from('teams').select('*');
    setTeams(data || []);
    
    // Load players for each team
    if (data) {
      for (const team of data) {
        const { data: tpData } = await supabase
          .from('tournament_players')
          .select('*, player_database(*)')
          .eq('team_id', team.id);
        setTeamPlayers(prev => ({ ...prev, [team.id]: tpData || [] }));
      }
    }
  };

  const loadPlayers = async () => {
    const { data } = await supabase.from('player_database').select('*').order('full_name');
    setPlayers(data || []);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await supabase.from('teams').insert([formData]);
    setShowForm(false);
    loadTeams();
  };

  const addPlayerToTeam = async () => {
    if (!selectedPlayer || !selectedTeam) return;
    
    await supabase.from('tournament_players').insert([{
      tournament_id: formData.tournament_id,
      player_id: parseInt(selectedPlayer),
      team_id: selectedTeam,
      status: 'confirmed'
    }]);
    
    setSelectedPlayer('');
    setSelectedTeam(null);
    loadTeams();
  };

  return (
    <div>
      <div className="flex justify-between mb-6">
        <h2 className="text-2xl font-bold">Teams</h2>
        <button onClick={() => setShowForm(!showForm)} className="bg-blue-600 text-white px-4 py-2 rounded">{showForm ? 'Cancel' : '+ New'}</button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow mb-6">
          <div className="grid grid-cols-2 gap-4">
            <input type="text" placeholder="Team Name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="border p-2 rounded" required />
            <select value={formData.division} onChange={(e) => setFormData({ ...formData, division: e.target.value })} className="border p-2 rounded">
              <option value="A">Division A</option>
              <option value="B">Division B</option>
            </select>
            <input type="color" value={formData.color} onChange={(e) => setFormData({ ...formData, color: e.target.value })} className="border p-2 rounded" />
          </div>
          <button type="submit" className="bg-green-600 text-white px-6 py-2 rounded mt-4">Create</button>
        </form>
      )}

      <div className="grid grid-cols-2 gap-4">
        {teams.map((t) => (
          <div key={t.id} className="bg-white p-4 rounded shadow" style={{ borderLeft: `4px solid ${t.color}` }}>
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="font-bold">{t.name}</h3>
                <p className="text-sm text-gray-600">Division {t.division}</p>
              </div>
              <button onClick={() => setSelectedTeam(t.id)} className="text-sm px-2 py-1 bg-blue-600 text-white rounded">Add Player</button>
            </div>
            
            <div className="mt-2 space-y-1">
              <p className="text-xs font-semibold text-gray-500">Players ({teamPlayers[t.id]?.length || 0}):</p>
              {teamPlayers[t.id]?.map(tp => (
                <p key={tp.id} className="text-xs text-gray-700">• {tp.player_database?.full_name}</p>
              ))}
            </div>
          </div>
        ))}
      </div>

      {selectedTeam && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">Add Player to Team</h3>
            <select value={selectedPlayer} onChange={(e) => setSelectedPlayer(e.target.value)} className="w-full px-3 py-2 border rounded-md mb-4">
              <option value="">Select player...</option>
              {players.map(p => (
                <option key={p.id} value={p.id}>{p.full_name} {p.handicap ? `(${p.handicap})` : ''}</option>
              ))}
            </select>
            <div className="flex gap-2">
              <button onClick={addPlayerToTeam} disabled={!selectedPlayer} className="flex-1 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50">Add</button>
              <button onClick={() => setSelectedTeam(null)} className="flex-1 px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
