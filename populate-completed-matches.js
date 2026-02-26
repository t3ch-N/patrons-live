/**
 * Script to populate all matches with completed status and scores
 * Run this to populate the leaderboard with results
 */

const fs = require('fs');
const path = require('path');

// Load matches data
const matchesPath = path.join(__dirname, 'src', 'data', 'matches.json');
const matchesData = JSON.parse(fs.readFileSync(matchesPath, 'utf8'));

console.log(`📊 Processing ${matchesData.length} matches...`);

// Seed random for reproducible results
let seed = 42;
function seededRandom() {
  seed = (seed * 1103515245 + 12345) & 0x7fffffff;
  return (seed / 0x7fffffff);
}

// Generate hole scores for a 2-way match (4BBB)
function generateTwoWayScores(teamAPar, teamBPar) {
  const holes = [];
  
  for (let i = 1; i <= 18; i++) {
    // Generate realistic scores around par (3-6)
    const teamAScore = Math.floor(seededRandom() * 4) + (teamAPar - 2); // par-2 to par+2
    const teamBScore = Math.floor(seededRandom() * 4) + (teamBPar - 2);
    
    // Ensure reasonable scores
    const finalTeamAScore = Math.max(2, Math.min(8, teamAScore));
    const finalTeamBScore = Math.max(2, Math.min(8, teamBScore));
    
    // Par for each hole (vary between 3-5)
    const pars = [4, 3, 4, 5, 3, 4, 5, 4, 4, 5, 3, 4, 3, 4, 4, 3, 4, 5];
    
    holes.push({
      number: i,
      par: pars[i - 1],
      teamAScore: finalTeamAScore,
      teamBScore: finalTeamBScore,
      teamCScore: null,
      teamAStrokes: null,
      teamBStrokes: null,
      teamCStrokes: null,
      status: 'completed',
      lastUpdated: new Date().toISOString()
    });
  }
  
  return holes;
}

// Generate hole scores for a 3-way match (Foursomes)
function generateThreeWayScores() {
  const holes = [];
  
  for (let i = 1; i <= 18; i++) {
    // Generate realistic scores around par for each team
    const teamAScore = Math.floor(seededRandom() * 4) + 3; // 3-6
    const teamBScore = Math.floor(seededRandom() * 4) + 3;
    const teamCScore = Math.floor(seededRandom() * 4) + 3;
    
    // Ensure reasonable scores
    const finalTeamAScore = Math.max(2, Math.min(8, teamAScore));
    const finalTeamBScore = Math.max(2, Math.min(8, teamBScore));
    const finalTeamCScore = Math.max(2, Math.min(8, teamCScore));
    
    // Par for each hole
    const pars = [4, 3, 4, 5, 3, 4, 5, 4, 4, 5, 3, 4, 3, 4, 4, 3, 4, 5];
    
    holes.push({
      number: i,
      par: pars[i - 1],
      teamAScore: finalTeamAScore,
      teamBScore: finalTeamBScore,
      teamCScore: finalTeamCScore,
      teamAStrokes: null,
      teamBStrokes: null,
      teamCStrokes: null,
      status: 'completed',
      lastUpdated: new Date().toISOString()
    });
  }
  
  return holes;
}

// Process each match
const updatedMatches = matchesData.map((match, index) => {
  // Set status to completed
  const updatedMatch = {
    ...match,
    status: 'completed'
  };
  
  // Generate hole scores based on match type
  if (match.isThreeWay) {
    updatedMatch.holes = generateThreeWayScores();
  } else {
    // For 2-way matches, generate random pars for each team
    const teamAPar = Math.floor(seededRandom() * 2) + 4; // 4-5
    const teamBPar = Math.floor(seededRandom() * 2) + 4;
    updatedMatch.holes = generateTwoWayScores(teamAPar, teamBPar);
  }
  
  if ((index + 1) % 20 === 0) {
    console.log(`  Processed ${index + 1} matches...`);
  }
  
  return updatedMatch;
});

// Save updated matches
fs.writeFileSync(matchesPath, JSON.stringify(updatedMatches, null, 2));

console.log(`✅ Successfully updated ${updatedMatches.length} matches with results!`);
console.log(`📈 Leaderboard should now show data.`);
