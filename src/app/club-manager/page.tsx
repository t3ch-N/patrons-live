'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default function ClubManagerPage() {
  const [club, setClub] = useState<any>(null);
  const [players, setPlayers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    fullName: '',
    phone: '',
    handicap: '',
    emergencyContactName: '',
    emergencyContactPhone: '',
    medicalConditions: '',
    dietaryRequirements: '',
    shirtSize: 'M'
  });
  const router = useRouter();

  useEffect(() => {
    loadClubData();
  }, []);

  const loadClubData = async () => {
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        router.push('/login');
        return;
      }

      const { data: managerData } = await supabase
        .from('club_managers')
        .select('*, clubs(*)')
        .eq('user_id', user.id)
        .single();

      if (!managerData) {
        alert('You are not assigned as a club manager');
        router.push('/dashboard');
        return;
      }

      setClub(managerData.clubs);

      const { data: playersData } = await supabase
        .from('player_database')
        .select('*')
        .eq('club_id', managerData.club_id)
        .order('full_name');

      setPlayers(playersData || []);
    } catch (error) {
      console.error('Error loading club data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const supabase = createClient();
      
      const { data, error } = await supabase.rpc('register_player_by_club_manager', {
        p_email: formData.email,
        p_full_name: formData.fullName,
        p_phone: formData.phone,
        p_club_id: club.id,
        p_handicap: formData.handicap ? parseFloat(formData.handicap) : null,
        p_emergency_contact_name: formData.emergencyContactName,
        p_emergency_contact_phone: formData.emergencyContactPhone,
        p_medical_conditions: formData.medicalConditions,
        p_dietary_requirements: formData.dietaryRequirements
      });

      if (error) throw error;

      alert('Player registered successfully!');
      setShowForm(false);
      setFormData({
        email: '', fullName: '', phone: '', handicap: '',
        emergencyContactName: '', emergencyContactPhone: '',
        medicalConditions: '', dietaryRequirements: '', shirtSize: 'M'
      });
      loadClubData();
    } catch (error: any) {
      alert(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h1 className="text-3xl font-bold mb-2">Club Manager Dashboard</h1>
          <p className="text-gray-600">{club?.name}</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-2">Total Players</h3>
            <p className="text-4xl font-bold text-blue-600">{players.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 col-span-2">
            <button
              onClick={() => setShowForm(true)}
              className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700"
            >
              + Register New Player
            </button>
          </div>
        </div>

        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 overflow-y-auto z-50">
            <div className="bg-white rounded-lg p-6 max-w-2xl w-full my-8">
              <h2 className="text-2xl font-bold mb-4">Register New Player</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Full Name *</label>
                    <input type="text" required value={formData.fullName} onChange={(e) => setFormData({...formData, fullName: e.target.value})} className="w-full px-3 py-2 border rounded-md" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Email *</label>
                    <input type="email" required value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full px-3 py-2 border rounded-md" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Phone *</label>
                    <input type="tel" required value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} className="w-full px-3 py-2 border rounded-md" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Handicap</label>
                    <input type="number" step="0.1" value={formData.handicap} onChange={(e) => setFormData({...formData, handicap: e.target.value})} className="w-full px-3 py-2 border rounded-md" />
                  </div>
                </div>

                <h3 className="font-semibold mt-6 mb-2">Emergency Contact</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Name</label>
                    <input type="text" value={formData.emergencyContactName} onChange={(e) => setFormData({...formData, emergencyContactName: e.target.value})} className="w-full px-3 py-2 border rounded-md" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Phone</label>
                    <input type="tel" value={formData.emergencyContactPhone} onChange={(e) => setFormData({...formData, emergencyContactPhone: e.target.value})} className="w-full px-3 py-2 border rounded-md" />
                  </div>
                </div>

                <h3 className="font-semibold mt-6 mb-2">Additional Information</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Medical Conditions</label>
                    <textarea value={formData.medicalConditions} onChange={(e) => setFormData({...formData, medicalConditions: e.target.value})} className="w-full px-3 py-2 border rounded-md" rows={2} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Dietary Requirements</label>
                    <textarea value={formData.dietaryRequirements} onChange={(e) => setFormData({...formData, dietaryRequirements: e.target.value})} className="w-full px-3 py-2 border rounded-md" rows={2} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Shirt Size</label>
                    <select value={formData.shirtSize} onChange={(e) => setFormData({...formData, shirtSize: e.target.value})} className="w-full px-3 py-2 border rounded-md">
                      <option value="XS">XS</option>
                      <option value="S">S</option>
                      <option value="M">M</option>
                      <option value="L">L</option>
                      <option value="XL">XL</option>
                      <option value="XXL">XXL</option>
                    </select>
                  </div>
                </div>

                <div className="flex gap-2 mt-6">
                  <button type="submit" disabled={loading} className="flex-1 bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 disabled:opacity-50">
                    {loading ? 'Registering...' : 'Register Player'}
                  </button>
                  <button type="button" onClick={() => setShowForm(false)} className="flex-1 bg-gray-300 py-2 rounded-md hover:bg-gray-400">
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-4">Club Players ({players.length})</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left">Name</th>
                  <th className="px-4 py-2 text-left">Email</th>
                  <th className="px-4 py-2 text-left">Phone</th>
                  <th className="px-4 py-2 text-left">Handicap</th>
                  <th className="px-4 py-2 text-left">Emergency Contact</th>
                </tr>
              </thead>
              <tbody>
                {players.map((player) => (
                  <tr key={player.id} className="border-t">
                    <td className="px-4 py-2">{player.full_name}</td>
                    <td className="px-4 py-2">{player.email}</td>
                    <td className="px-4 py-2">{player.phone}</td>
                    <td className="px-4 py-2">{player.handicap || 'N/A'}</td>
                    <td className="px-4 py-2 text-sm">
                      {player.emergency_contact_name ? (
                        <div>
                          <p>{player.emergency_contact_name}</p>
                          <p className="text-gray-500">{player.emergency_contact_phone}</p>
                        </div>
                      ) : 'N/A'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
