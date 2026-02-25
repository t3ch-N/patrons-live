'use client';

import teamsData from '@/data/teams.json';
import playersData from '@/data/players.json';
import matchesData from '@/data/matches.json';
import scoresData from '@/data/scores.json';

export default function TestPage() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Data Test Page</h1>
      
      <div className="space-y-4">
        <div className="bg-green-100 p-4 rounded">
          <h2 className="font-bold">✅ Teams: {teamsData.length}</h2>
          <p>{teamsData.slice(0, 3).map(t => t.name).join(', ')}</p>
        </div>
        
        <div className="bg-blue-100 p-4 rounded">
          <h2 className="font-bold">✅ Players: {playersData.length}</h2>
          <p>{playersData.slice(0, 3).map(p => p.name).join(', ')}</p>
        </div>
        
        <div className="bg-yellow-100 p-4 rounded">
          <h2 className="font-bold">✅ Matches: {matchesData.length}</h2>
        </div>
        
        <div className="bg-purple-100 p-4 rounded">
          <h2 className="font-bold">✅ Scores: {scoresData.length}</h2>
        </div>
      </div>
    </div>
  );
}
