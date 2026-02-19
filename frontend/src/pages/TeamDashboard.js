import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import socket from '../socket/socket';
import axios from 'axios';

const TeamDashboard = () => {
  const { user, token } = useAuth();
  const [balance, setBalance] = useState(user?.coins || 0);
  const [bidAmount, setBidAmount] = useState('');
  const [roundActive, setRoundActive] = useState(false);
  const [message, setMessage] = useState('');
  const [leaderboard, setLeaderboard] = useState([]);
  const [question, setQuestion] = useState({ title: '', category: '' });
  const [timer, setTimer] = useState(20);
  const [hasBid, setHasBid] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    socket.on('round-started', ({ questionTitle, category, duration }) => {
      setRoundActive(true);
      setQuestion({ title: questionTitle, category });
      setTimer(duration);
      setHasBid(false);
      setMessage('');
      if (timerRef.current) clearInterval(timerRef.current);
      timerRef.current = setInterval(() => {
        setTimer(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            setRoundActive(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    });

    socket.on('round-ended', () => {
      setRoundActive(false);
      if (timerRef.current) clearInterval(timerRef.current);
    });

    socket.on('leaderboard-update', fetchLeaderboard);

    fetchLeaderboard();

    return () => {
      socket.off('round-started');
      socket.off('round-ended');
      socket.off('leaderboard-update');
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const fetchLeaderboard = async () => {
    try {
      const res = await axios.get('/api/team/leaderboard');
      setLeaderboard(res.data);
      const myTeam = res.data.find(t => t.teamName === user?.teamName);
      if (myTeam) setBalance(myTeam.coins);
    } catch (err) {
      console.error(err);
    }
  };

  const validateBid = (amount) => {
    const num = parseInt(amount);
    if (isNaN(num) || amount === '') return 'Please enter a number';
    if (num <= 0) return 'Enter positive amount';
    if (num > balance) return `Enter amount ≤ ${balance}`;
    return '';
  };

  const handleBid = async (e) => {
    e.preventDefault();
    const errorMsg = validateBid(bidAmount);
    if (errorMsg) {
      setMessage(errorMsg);
      return;
    }
    try {
      await axios.post('/api/team/bid', { amount: parseInt(bidAmount) }, {
        headers: { 'x-auth-token': token }
      });
      setMessage('Bid placed!');
      setHasBid(true);
      setBidAmount('');
    } catch (err) {
      setMessage(err.response?.data?.msg || 'Error placing bid');
    }
  };

  return (
    <div className="team-dashboard">
      <h2>Team: {user?.teamName}</h2>
      <div className="coin-display">💰 {balance} coins</div>

      {roundActive ? (
        <>
          <div className="question-info">
            <h3>Question: {question.title}</h3>
            <p>Category: {question.category}</p>
          </div>
          <div className="timer">Time left: {timer}s</div>
          {!hasBid ? (
            <form onSubmit={handleBid}>
              <input
                type="number"
                placeholder="Enter bid amount"
                value={bidAmount}
                onChange={(e) => setBidAmount(e.target.value)}
                min="1"
                required
              />
              <button type="submit" disabled={!!validateBid(bidAmount)}>Place Bid</button>
            </form>
          ) : (
            <p>You have placed your bid. Waiting for round to end...</p>
          )}
        </>
      ) : (
        <p>Bidding is closed. Wait for next round.</p>
      )}
      {message && <p className="message">{message}</p>}

      <h3>Leaderboard</h3>
      <table>
        <thead>
          <tr><th>Rank</th><th>Team</th><th>Coins</th></tr>
        </thead>
        <tbody>
          {leaderboard.map((team, idx) => (
            <tr key={team._id}>
              <td>{idx+1}</td>
              <td>{team.teamName}</td>
              <td>{team.coins}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TeamDashboard;