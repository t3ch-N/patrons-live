'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase';

export default function KepsaRegistrationPage() {
  const [registrationType, setRegistrationType] = useState('individual');
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    additionalPlayers: ['', '', '']
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const getPrice = () => {
    const now = new Date();
    const earlyBirdDeadline = new Date('2026-03-10');
    const isEarlyBird = now < earlyBirdDeadline;

    if (registrationType === 'individual') {
      return isEarlyBird ? 3500 : 4000;
    } else {
      return 14000;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const supabase = createClient();
      const amount = getPrice();

      // Create registration record
      const { data: registration, error: regError } = await supabase
        .from('tournament_registrations')
        .insert({
          tournament_id: 1, // KEPSA tournament ID
          registration_type_id: registrationType === 'individual' ? 1 : 2,
          full_name: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          amount_paid: amount,
          payment_status: 'pending',
          additional_players: registrationType === '4ball' ? formData.additionalPlayers : null
        })
        .select()
        .single();

      if (regError) throw regError;

      // Trigger M-Pesa STK Push
      const mpesaResponse = await fetch('/api/mpesa/stk-push', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phoneNumber: formData.phone,
          amount: amount,
          registrationId: registration.id,
          accountReference: `REG-${registration.id}`
        })
      });

      const mpesaData = await mpesaResponse.json();

      if (mpesaData.success) {
        // Update registration with checkout request ID
        await supabase
          .from('tournament_registrations')
          .update({
            checkout_request_id: mpesaData.checkoutRequestId,
            merchant_request_id: mpesaData.merchantRequestId
          })
          .eq('id', registration.id);

        setMessage(`STK Push sent! Check your phone to complete payment. Registration ID: ${registration.id}`);
      } else {
        throw new Error(mpesaData.message || 'M-Pesa payment failed');
      }

      setFormData({ fullName: '', email: '', phone: '', additionalPlayers: ['', '', ''] });
    } catch (error: any) {
      setMessage(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-xl p-8 mb-6">
          <h1 className="text-3xl font-bold text-center mb-2">KEPSA Foundation Annual Charity Golf Tournament</h1>
          <p className="text-center text-gray-600 mb-4">Friday, March 20th, 2026 | Karen Country Club</p>
          
          <div className="bg-blue-50 border-l-4 border-blue-600 p-4 mb-6">
            <p className="font-semibold mb-2">Join us for an exciting day of:</p>
            <ul className="list-disc list-inside space-y-1 text-gray-700">
              <li>Golf</li>
              <li>Networking & Mentorship</li>
              <li>Philanthropy</li>
            </ul>
          </div>

          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <div className={`border-2 rounded-lg p-4 cursor-pointer ${registrationType === 'individual' ? 'border-blue-600 bg-blue-50' : 'border-gray-300'}`} onClick={() => setRegistrationType('individual')}>
              <h3 className="font-bold text-lg mb-2">Individual</h3>
              <p className="text-2xl font-bold text-blue-600">KES {getPrice()}</p>
              {new Date() < new Date('2026-03-10') && (
                <p className="text-sm text-green-600 mt-2">Early Bird Price! (Until March 10th)</p>
              )}
            </div>
            <div className={`border-2 rounded-lg p-4 cursor-pointer ${registrationType === '4ball' ? 'border-blue-600 bg-blue-50' : 'border-gray-300'}`} onClick={() => setRegistrationType('4ball')}>
              <h3 className="font-bold text-lg mb-2">4-Ball</h3>
              <p className="text-2xl font-bold text-blue-600">KES 14,000</p>
              <p className="text-sm text-gray-600 mt-2">4 players included</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Full Name *</label>
              <input
                type="text"
                required
                value={formData.fullName}
                onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-md focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none text-gray-900 bg-white text-base"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Email *</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-md focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none text-gray-900 bg-white text-base"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">M-Pesa Phone Number *</label>
              <input
                type="tel"
                required
                placeholder="254712345678"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-md focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none text-gray-900 bg-white text-base placeholder-gray-400"
              />
              <p className="text-xs text-gray-500 mt-1">Format: 254XXXXXXXXX</p>
            </div>

            {registrationType === '4ball' && (
              <div>
                <label className="block text-sm font-medium mb-2">Additional Players (3 more)</label>
                {[0, 1, 2].map((i) => (
                  <input
                    key={i}
                    type="text"
                    placeholder={`Player ${i + 2} Name`}
                    value={formData.additionalPlayers[i]}
                    onChange={(e) => {
                      const newPlayers = [...formData.additionalPlayers];
                      newPlayers[i] = e.target.value;
                      setFormData({...formData, additionalPlayers: newPlayers});
                    }}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-md focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none text-gray-900 bg-white text-base placeholder-gray-400 mb-2"
                  />
                ))}
              </div>
            )}

            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Payment Details:</h3>
              <p className="text-sm text-gray-700">Paybill: 880100</p>
              <p className="text-sm text-gray-700">Account No: 3380270063</p>
              <p className="text-lg font-bold text-green-600 mt-2">Total: KES {getPrice()}</p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 text-white py-3 rounded-md hover:bg-green-700 disabled:opacity-50 font-semibold"
            >
              {loading ? 'Processing...' : 'Pay with M-Pesa'}
            </button>
          </form>

          {message && (
            <div className={`mt-4 p-3 rounded ${message.includes('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
              {message}
            </div>
          )}

          <div className="mt-6 text-center text-sm text-gray-600">
            <p>With your 2025 sponsorship, we were able to advance our:</p>
            <p className="font-semibold">Orchards for Schools and Better Business Practices for Children Programmes</p>
          </div>
        </div>
      </div>
    </div>
  );
}
