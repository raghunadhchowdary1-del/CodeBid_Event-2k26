import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const ADMIN_EMAILS = [
  '238w1a12a8@vrsec.ac.in',
  '238w1a1283@vrsec.ac.in',
  '238w1a12a7@vrsec.ac.in',
  '238w1a12a2@vrsec.ac.in'
];

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState('participant');
  const [error, setError] = useState('');
  const { login, isAuthenticated, role } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      if (role === 'admin') navigate('/admin');
      else navigate('/team');
    }
  }, [isAuthenticated, role, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (userType === 'admin' && !ADMIN_EMAILS.includes(email)) {
      setError('This email is not authorized for admin login.');
      return;
    }

    // For admin, password is not required (backend ignores it)
    const loginPassword = userType === 'admin' ? 'any' : password;

    const result = await login(email, loginPassword);
    if (!result.success) {
      setError(result.error);
    }
  };

  return (
    <div className="login-container">
      <h2>CODEBID Login</h2>

      <div className="role-selector">
        <label>
          <input
            type="radio"
            value="participant"
            checked={userType === 'participant'}
            onChange={() => setUserType('participant')}
          />
          Participant
        </label>
        <label>
          <input
            type="radio"
            value="admin"
            checked={userType === 'admin'}
            onChange={() => setUserType('admin')}
          />
          Admin
        </label>
      </div>

      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        {userType === 'participant' && (
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        )}
        <button type="submit">Login</button>
      </form>

      {error && <p className="error">{error}</p>}

      {userType === 'participant' && (
        <p>
          Don't have an account? <a href="/signup">Sign up</a>
        </p>
      )}
    </div>
  );
};

export default Login;