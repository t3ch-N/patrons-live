'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        router.push('/login');
        return;
      }

      setUser(user);

      const { data: userData } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();

      const { data: playerData } = await supabase
        .from('player_database')
        .select('*')
        .eq('user_id', user.id)
        .single();

      setProfile({ ...userData, ...playerData });
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/login');
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">My Profile</h1>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Logout
          </button>
        </div>

        {profile && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-600">Name</label>
              <p className="text-lg">{profile.full_name}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600">Email</label>
              <p className="text-lg">{profile.email}</p>
            </div>

            {profile.phone && (
              <div>
                <label className="block text-sm font-medium text-gray-600">Phone</label>
                <p className="text-lg">{profile.phone}</p>
              </div>
            )}

            {profile.handicap && (
              <div>
                <label className="block text-sm font-medium text-gray-600">Handicap</label>
                <p className="text-lg">{profile.handicap}</p>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-600">Role</label>
              <p className="text-lg capitalize">{profile.role}</p>
            </div>

            {profile.role === 'admin' && (
              <div className="mt-6 pt-6 border-t">
                <a
                  href="/admin"
                  className="inline-block px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Go to Admin Dashboard
                </a>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
