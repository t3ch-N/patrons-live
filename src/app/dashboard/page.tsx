'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [role, setRole] = useState<string>('');
  const [tournaments, setTournaments] = useState<any[]>([]);
  const [myTeam, setMyTeam] = useState<any>(null);
  const [teamPlayers, setTeamPlayers] = useState<any[]>([]);
  const [availablePlayers, setAvailablePlayers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlayer, setSelectedPlayer] = useState<string>('');
  const router = useRouter();

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        router.push('/login');
        return;
      }

      const { data: userData } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();

      setUser(userData);
      setRole(userData?.role || 'player');

      // Load tournaments
      const { data: tournamentsData } = await supabase
        .from('tournaments')
        .select('*')
        .order('start_date', { ascending: false });
      setTournaments(tournamentsData || []);

      // If team captain, load their team
      if (userData?.role === 'team_captain') {
        const { data: roleData } = await supabase
          .from('tournament_roles')
          .select('*, teams(*), tournaments(*)')
          .eq('user_id', user.id)
          .eq('role', 'team_captain')
          .single();

        if (roleData) {
          setMyTeam(roleData);
          
          // Load team players
          const { data: playersData } = await supabase
            .from('tournament_players')
            .select('*, player_database(*)')
            .eq('tournament_id', roleData.tournament_id)
            .eq('team_id', roleData.team_id);
          setTeamPlayers(playersData || []);

          // Load available players
          const { data: allPlayers } = await supabase
            .from('player_database')
            .select('*')
            .order('full_name');
          setAvailablePlayers(allPlayers || []);
        }
      }
    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const addPlayerToTeam = async () => {
    if (!selectedPlayer || !myTeam) return;

    try {
      const supabase = createClient();
      const { error } = await supabase
        .from('tournament_players')
        .insert({
          tournament_id: myTeam.tournament_id,
          player_id: parseInt(selectedPlayer),
          team_id: myTeam.team_id,
          status: 'confirmed'
        });

      if (error) throw error;

      alert('Player added successfully!');
      setSelectedPlayer('');
      loadDashboard();
    } catch (error: any) {
      alert(`Error: ${error.message}`);
    }
  };

  const removePlayer = async (playerId: number) => {
    if (!confirm('Remove this player from the team?')) return;

    try {
      const supabase = createClient();
      const { error } = await supabase
        .from('tournament_players')
        .delete()
        .eq('id', playerId);

      if (error) throw error;

      alert('Player removed!');
      loadDashboard();
    } catch (error: any) {
      alert(`Error: ${error.message}`);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold">Dashboard</h1>
              <p className="text-gray-600">Welcome, {user?.full_name}</p>
              <p className="text-sm text-gray-500 capitalize">Role: {role}</p>
            </div>
            <div className="space-x-2">
              <a href="/profile" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                Profile
              </a>
              {role === 'admin' && (
                <a href="/admin" className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700">
                  Admin
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Team Captain View */}
        {role === 'team_captain' && myTeam && (
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold mb-4">My Team: {myTeam.teams?.name}</h2>
              <p className="text-sm text-gray-600 mb-4">Tournament: {myTeam.tournaments?.name}</p>
              
              <div className="space-y-2 mb-6">
                <h3 className="font-semibold">Team Players ({teamPlayers.length})</h3>
                {teamPlayers.map((tp) => (
                  <div key={tp.id} className="flex justify-between items-center border rounded p-2">
                    <div>
                      <p className="font-medium">{tp.player_database?.full_name}</p>
                      <p className="text-xs text-gray-500">Handicap: {tp.player_database?.handicap || 'N/A'}</p>
                    </div>
                    <button
                      onClick={() => removePlayer(tp.id)}
                      className="text-sm px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>

              <div>
                <h3 className="font-semibold mb-2">Add Player</h3>
                <div className="flex gap-2">
                  <select
                    value={selectedPlayer}
                    onChange={(e) => setSelectedPlayer(e.target.value)}
                    className="flex-1 px-3 py-2 border rounded-md"
                  >
                    <option value="">Select player...</option>
                    {availablePlayers.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.full_name} {p.handicap ? `(${p.handicap})` : ''}
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={addPlayerToTeam}
                    disabled={!selectedPlayer}
                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold mb-4">Tournament Info</h2>
              <div className="space-y-2">
                <div>
                  <label className="text-sm text-gray-600">Start Date</label>
                  <p>{new Date(myTeam.tournaments?.start_date).toLocaleDateString()}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-600">End Date</label>
                  <p>{new Date(myTeam.tournaments?.end_date).toLocaleDateString()}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-600">Location</label>
                  <p>{myTeam.tournaments?.location}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Club Manager View */}
        {role === 'club_manager' && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-4">Club Management</h2>
            <p className="text-gray-600 mb-4">Manage your club and register players</p>
            <a
              href="/club-manager"
              className="inline-block px-6 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
            >
              Go to Club Manager Dashboard
            </a>
          </div>
        )}

        {/* Tournament Manager View */}
        {role === 'tournament_manager' && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-4">My Tournaments</h2>
            <p className="text-gray-600 mb-4">Use the CMS to manage your tournaments</p>
            <a
              href="/cms"
              className="inline-block px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Go to CMS
            </a>
          </div>
        )}

        {/* Player View */}
        {role === 'player' && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-4">Tournaments</h2>
            <div className="space-y-2">
              {tournaments.map((t) => (
                <div key={t.id} className="border rounded p-3">
                  <p className="font-semibold">{t.name}</p>
                  <p className="text-sm text-gray-600">{t.location}</p>
                  <p className="text-xs text-gray-500">
                    {new Date(t.start_date).toLocaleDateString()} - {new Date(t.end_date).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
