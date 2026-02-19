import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import socket from '../socket/socket';
import axios from 'axios';

const AdminDashboard = () => {
  const { token } = useAuth();
  const [teams, setTeams] = useState([]);
  const [bids, setBids] = useState([]);
  const [winner, setWinner] = useState(null);
  const [roundActive, setRoundActive] = useState(false);
  const [questionTitle, setQuestionTitle] = useState('');
  const [category, setCategory] = useState('Easy');
  const [resultProcessed, setResultProcessed] = useState(false);

  useEffect(() => {
    socket.emit('join-admin');

    socket.on('new-bid', (bid) => {
      setBids(prev => [...prev, bid]);
    });

    socket.on('round-ended', ({ winner }) => {
      setRoundActive(false);
      setWinner(winner);   // winner now contains { team, id, amount, roundId }
      setResultProcessed(false);
      console.log('Winner received:', winner);
    });

    socket.on('round-started', () => {
      setRoundActive(true);
      setBids([]);
      setWinner(null);
      setResultProcessed(false);
    });

    fetchTeams();
    fetchCurrentBids();

    return () => {
      socket.off('new-bid');
      socket.off('round-ended');
      socket.off('round-started');
    };
  }, []);

  const fetchTeams = async () => {
    const res = await axios.get('/api/admin/teams', { headers: { 'x-auth-token': token } });
    setTeams(res.data);
  };

  const fetchCurrentBids = async () => {
    const res = await axios.get('/api/admin/bids', { headers: { 'x-auth-token': token } });
    setBids(res.data);
  };

  const startRound = async () => {
    if (!questionTitle.trim()) {
      alert('Please enter a question title');
      return;
    }
    await axios.post('/api/admin/start-round', { questionTitle, category }, { headers: { 'x-auth-token': token } });
  };

  const endRound = async () => {
    await axios.post('/api/admin/end-round', {}, { headers: { 'x-auth-token': token } });
  };

  const markResult = async (teamId, roundId, correct, bidAmount) => {
    if (resultProcessed) return;
    setResultProcessed(true);
    try {
      console.log('Sending mark-result:', { teamId, roundId, correct, bidAmount });
      const res = await axios.post('/api/admin/mark-result',
        { teamId, correct, bidAmount, roundId },
        { headers: { 'x-auth-token': token } }
      );
      console.log('Mark-result response:', res.data);
      fetchTeams(); // refresh leaderboard
    } catch (err) {
      console.error('Mark-result error:', err.response?.data || err.message);
      setResultProcessed(false);
    }
  };

  const resetCoins = async () => {
    await axios.post('/api/admin/reset-coins', {}, { headers: { 'x-auth-token': token } });
    fetchTeams();
  };

  const restartRound = () => {
    setQuestionTitle('');
    setCategory('Easy');
    setWinner(null);
    setBids([]);
    setResultProcessed(false);
  };

  return (
    <div className="admin-dashboard">
      <h1>Admin Panel</h1>

      {/* Leaderboard */}
      <div className="leaderboard-section">
        <h2>Leaderboard</h2>
        <table>
          <thead>
            <tr><th>Rank</th><th>Team</th><th>Coins</th></tr>
          </thead>
          <tbody>
            {teams.sort((a,b) => b.coins - a.coins).map((team, idx) => (
              <tr key={team._id}>
                <td>{idx+1}</td>
                <td>{team.teamName}</td>
                <td>{team.coins}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Question Setup */}
      <div className="question-setup">
        <h2>New Round</h2>
        <input
          type="text"
          placeholder="Question Title"
          value={questionTitle}
          onChange={(e) => setQuestionTitle(e.target.value)}
          disabled={roundActive}
        />
        <select value={category} onChange={(e) => setCategory(e.target.value)} disabled={roundActive}>
          <option value="Easy">Easy</option>
          <option value="Medium">Medium</option>
          <option value="Hard">Hard</option>
        </select>
        <button onClick={startRound} disabled={roundActive}>Start Bidding</button>
        <button onClick={restartRound} disabled={roundActive}>Restart</button>
      </div>

      {/* Bidding Control */}
      {roundActive && (
        <div className="bidding-control">
          <h2>Live Bids</h2>
          <table>
            <thead>
              <tr><th>Team</th><th>Bid</th><th>Time</th></tr>
            </thead>
            <tbody>
              {bids.map((bid, idx) => (
                <tr key={idx}>
                  <td>{bid.team?.teamName}</td>
                  <td>{bid.amount}</td>
                  <td>{new Date(bid.timestamp).toLocaleTimeString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <button onClick={endRound}>End Bidding</button>
        </div>
      )}

      {/* Winner & Result */}
      {winner && !resultProcessed && (
        <div className="winner-section">
          <h2>Winner: {winner.team} (Bid: {winner.amount})</h2>
          <button
            onClick={() => markResult(winner.id, winner.roundId, true, winner.amount)}
            disabled={resultProcessed}
          >
            ✅ Correct
          </button>
          <button
            onClick={() => markResult(winner.id, winner.roundId, false, winner.amount)}
            disabled={resultProcessed}
          >
            ❌ Wrong
          </button>
        </div>
      )}

      {winner && resultProcessed && (
        <div className="winner-section">
          <h2>Winner: {winner.team} (Result recorded)</h2>
          <p>Buttons disabled until next round.</p>
        </div>
      )}

      {/* Reset Coins */}
      <button className="reset-coins" onClick={resetCoins}>Reset All Coins to 2000</button>
    </div>
  );
};

export default AdminDashboard;