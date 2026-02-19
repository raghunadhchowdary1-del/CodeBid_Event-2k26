import React, { createContext, useReducer, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext();

const initialState = {
  token: localStorage.getItem('token'),
  isAuthenticated: null,
  user: null,
  role: null,
  loading: true
};

const authReducer = (state, action) => {
  switch (action.type) {
    case 'USER_LOADED':
      return { ...state, isAuthenticated: true, user: action.payload, role: action.payload.role, loading: false };
    case 'LOGIN_SUCCESS':
      localStorage.setItem('token', action.payload.token);
      return { ...state, token: action.payload.token, isAuthenticated: true, role: action.payload.role, loading: false };
    case 'LOGOUT':
      localStorage.removeItem('token');
      return { ...state, token: null, isAuthenticated: false, user: null, role: null, loading: false };
    default:
      return state;
  }
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  const loadUser = async () => {
    if (!state.token) {
      dispatch({ type: 'LOGOUT' });
      return;
    }
    try {
      const res = await axios.get('/api/team/me', {
        headers: { 'x-auth-token': state.token }
      });
      dispatch({ type: 'USER_LOADED', payload: res.data });
    } catch (err) {
      dispatch({ type: 'LOGOUT' });
    }
  };

  const login = async (email, password) => {
    const config = { headers: { 'Content-Type': 'application/json' } };
    const body = JSON.stringify({ email, password });
    try {
      const res = await axios.post('/api/auth/login', body, config);
      dispatch({ type: 'LOGIN_SUCCESS', payload: res.data });
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.msg || 'Login failed';
      return { success: false, error: msg };
    }
  };

  const signup = async (formData) => {
    const config = { headers: { 'Content-Type': 'application/json' } };
    try {
      const res = await axios.post('/api/auth/signup', formData, config);
      // Ensure no token is stored after signup
      localStorage.removeItem('token');
      dispatch({ type: 'LOGOUT' }); // Clear any existing session
      return { success: true, data: res.data };
    } catch (err) {
      const msg = err.response?.data?.msg || 'Signup failed';
      return { success: false, error: msg };
    }
  };

  const logout = () => dispatch({ type: 'LOGOUT' });

  return (
    <AuthContext.Provider value={{ ...state, loadUser, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);