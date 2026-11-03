import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../api/apiClient';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('civicvote_token') || null);
  const [loading, setLoading] = useState(true);

  // Initialize user from saved token
  useEffect(() => {
    const savedUser = localStorage.getItem('civicvote_user');
    if (savedUser && token) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        localStorage.removeItem('civicvote_user');
      }
    }
    setLoading(false);
  }, [token]);

  const login = async (username, password) => {
    const data = await api.login({ username, password });
    const userData = {
      username: data.username,
      role: data.role,
      userId: data.userId,
    };
    localStorage.setItem('civicvote_token', data.token);
    localStorage.setItem('civicvote_user', JSON.stringify(userData));
    setToken(data.token);
    setUser(userData);
    return userData;
  };

  const register = async (username, email, password, role) => {
    const data = await api.register({ username, email, password, role });
    const userData = {
      username: data.username,
      role: data.role,
      userId: data.userId,
    };
    localStorage.setItem('civicvote_token', data.token);
    localStorage.setItem('civicvote_user', JSON.stringify(userData));
    setToken(data.token);
    setUser(userData);
    return userData;
  };

  const quickLogin = async (roleType) => {
    if (roleType === 'ADMIN') {
      return await login('admin_user', 'Password@123');
    } else {
      return await login('voter_john', 'Password@123');
    }
  };

  const logout = () => {
    localStorage.removeItem('civicvote_token');
    localStorage.removeItem('civicvote_user');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token && !!user,
        isAdmin: user?.role === 'ADMIN',
        isVoter: user?.role === 'VOTER',
        login,
        register,
        quickLogin,
        logout,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
