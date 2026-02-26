'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default function AdminPage() {
  const [players, setPlayers] = useState<any[]>([]);
  const [tournaments, setTournaments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlayer, setSelectedPlayer] = useState<any>(null);
  const [newRole, setNewRole] = useState('player');
  const router = useRouter();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        router.push('/login');
        return;
      }

      const { data: userData } = await supabase
        .from('users')
        .select('role')
        .eq('id', user.id)
        .single();

      if (userData?.role !== 'admin') {
        router.push('/profile');
        return;
      }

      loadData();
    } catch (error) {
      console.error('Auth error:', error);
      router.push('/login');
    }
  };

  const loadData = async () => {
    try {
      const supabase = createClient();

      // Load all players
      const { data: playersData } = await supabase
        .from('player_database')
        .select(`
          *,
          users (email, role)
        `)
        .order('created_at', { ascending: false });

      setPlayers(playersData || []);

      // Load tournaments
      const { data: tournamentsData } = await supabase
        .from('tournaments')
        .select('*')
        .order('start_date', { ascending: false });

      setTournaments(tournamentsData || []);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateUserRole = async (userId: string, role: string) => {
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from('users')
        .update({ role })
        .eq('id', userId);

      if (error) throw error;

      alert('Role updated successfully!');
      loadData();
      setSelectedPlayer(null);
    } catch (error: any) {
      alert(`Error: ${error.message}`);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Manage players, roles, and tournaments</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Players Section */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-4">Players ({players.length})</h2>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {players.map((player) => (
                <div key={player.id} className="border rounded p-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold">{player.full_name}</p>
                      <p className="text-sm text-gray-600">{player.users?.email}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        Role: <span className="font-medium capitalize">{player.users?.role || 'player'}</span>
                      </p>
                      {player.handicap && (
                        <p className="text-xs text-gray-500">Handicap: {player.handicap}</p>
                      )}
                    </div>
                    <button
                      onClick={() => setSelectedPlayer(player)}
                      className="text-sm px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                      Edit Role
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tournaments Section */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-4">Tournaments ({tournaments.length})</h2>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {tournaments.map((tournament) => (
                <div key={tournament.id} className="border rounded p-3">
                  <p className="font-semibold">{tournament.name}</p>
                  <p className="text-sm text-gray-600">{tournament.slug}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(tournament.start_date).toLocaleDateString()} - {new Date(tournament.end_date).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Edit Role Modal */}
        {selectedPlayer && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
              <h3 className="text-xl font-bold mb-4">Edit Role: {selectedPlayer.full_name}</h3>
              
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Select Role</label>
                <select
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md"
                >
                  <option value="player">Player</option>
                  <option value="team_captain">Team Captain</option>
                  <option value="tournament_manager">Tournament Manager</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => updateUserRole(selectedPlayer.user_id, newRole)}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Update Role
                </button>
                <button
                  onClick={() => setSelectedPlayer(null)}
                  className="flex-1 px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
