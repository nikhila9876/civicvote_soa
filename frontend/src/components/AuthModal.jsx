import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { X, Lock, User, Mail, ShieldAlert, Sparkles, CheckCircle2 } from 'lucide-react';

export const AuthModal = ({ isOpen, onClose, initialMode = 'login', onToast }) => {
  const { login, register, quickLogin } = useAuth();
  const [mode, setMode] = useState(initialMode); // 'login' or 'register'
  
  // Form states
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('VOTER');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (mode === 'login') {
        const u = await login(username, password);
        onToast({
          type: 'success',
          title: 'Welcome Back!',
          message: `Logged in as ${u.username} (${u.role})`,
        });
      } else {
        const u = await register(username, email, password, role);
        onToast({
          type: 'success',
          title: 'Account Created!',
          message: `Registered as ${u.username} (${u.role})`,
        });
      }
      onClose();
    } catch (err) {
      setError(err.message || 'Authentication failed. Please verify your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuick = async (roleType) => {
    setError(null);
    setLoading(true);
    try {
      const u = await quickLogin(roleType);
      onToast({
        type: 'success',
        title: 'Demo Session Active',
        message: `Logged in as ${u.username} (${u.role})`,
      });
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to authenticate demo user.');
    } finally {
      setLoading(false);
    }
  };

  const generateRandomVoter = () => {
    const randomId = Math.floor(100 + Math.random() * 900);
    setUsername(`voter_${randomId}`);
    setEmail(`voter${randomId}@civicvote.com`);
    setPassword('Password@123');
    setRole('VOTER');
    setMode('register');
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        style={{ maxWidth: '440px' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            padding: '20px 24px',
            borderBottom: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={() => { setMode('login'); setError(null); }}
              style={{
                background: 'none',
                border: 'none',
                padding: '4px 8px',
                fontSize: '1rem',
                fontWeight: mode === 'login' ? 700 : 500,
                color: mode === 'login' ? '#ffffff' : '#64748b',
                cursor: 'pointer',
                borderBottom: mode === 'login' ? '2px solid var(--color-indigo)' : 'none',
              }}
            >
              Sign In
            </button>
            <button
              onClick={() => { setMode('register'); setError(null); }}
              style={{
                background: 'none',
                border: 'none',
                padding: '4px 8px',
                fontSize: '1rem',
                fontWeight: mode === 'register' ? 700 : 500,
                color: mode === 'register' ? '#ffffff' : '#64748b',
                cursor: 'pointer',
                borderBottom: mode === 'register' ? '2px solid var(--color-indigo)' : 'none',
              }}
            >
              Register
            </button>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: '#64748b',
              cursor: 'pointer',
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Quick Demo Shortcuts */}
        <div
          style={{
            padding: '16px 24px 0',
          }}
        >
          <div
            style={{
              fontSize: '0.75rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              color: '#64748b',
              marginBottom: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <span>⚡ 1-Click Fast Credentials</span>
            <button
              type="button"
              onClick={generateRandomVoter}
              style={{
                background: 'none',
                border: 'none',
                color: '#38bdf8',
                fontSize: '0.75rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              <Sparkles size={12} />
              <span>Random Voter</span>
            </button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            <button
              type="button"
              onClick={() => handleQuick('ADMIN')}
              className="btn btn-outline"
              style={{
                padding: '8px',
                fontSize: '0.8rem',
                borderColor: 'rgba(244, 63, 94, 0.3)',
                color: '#fb7185',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
              }}
            >
              <Lock size={14} />
              <span>Demo Admin</span>
            </button>
            <button
              type="button"
              onClick={() => handleQuick('VOTER')}
              className="btn btn-outline"
              style={{
                padding: '8px',
                fontSize: '0.8rem',
                borderColor: 'rgba(16, 185, 129, 0.3)',
                color: '#34d399',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
              }}
            >
              <CheckCircle2 size={14} />
              <span>Demo Voter</span>
            </button>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} style={{ padding: '20px 24px' }}>
          {error && (
            <div
              style={{
                background: 'rgba(244, 63, 94, 0.12)',
                border: '1px solid rgba(244, 63, 94, 0.3)',
                borderRadius: '8px',
                padding: '10px 14px',
                fontSize: '0.85rem',
                color: '#fb7185',
                marginBottom: '16px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <ShieldAlert size={16} />
              <span>{error}</span>
            </div>
          )}

          <div style={{ marginBottom: '14px' }}>
            <label
              style={{
                display: 'block',
                fontSize: '0.8rem',
                fontWeight: 600,
                color: '#94a3b8',
                marginBottom: '6px',
              }}
            >
              Username
            </label>
            <div style={{ position: 'relative' }}>
              <User
                size={16}
                color="#64748b"
                style={{ position: 'absolute', left: '12px', top: '12px' }}
              />
              <input
                type="text"
                required
                className="input-control"
                placeholder="e.g. voter_john or admin_user"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                style={{ paddingLeft: '38px' }}
              />
            </div>
          </div>

          {mode === 'register' && (
            <div style={{ marginBottom: '14px' }}>
              <label
                style={{
                  display: 'block',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  color: '#94a3b8',
                  marginBottom: '6px',
                }}
              >
                Email Address
              </label>
              <div style={{ position: 'relative' }}>
                <Mail
                  size={16}
                  color="#64748b"
                  style={{ position: 'absolute', left: '12px', top: '12px' }}
                />
                <input
                  type="email"
                  required
                  className="input-control"
                  placeholder="voter@civicvote.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{ paddingLeft: '38px' }}
                />
              </div>
            </div>
          )}

          <div style={{ marginBottom: '14px' }}>
            <label
              style={{
                display: 'block',
                fontSize: '0.8rem',
                fontWeight: 600,
                color: '#94a3b8',
                marginBottom: '6px',
              }}
            >
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <Lock
                size={16}
                color="#64748b"
                style={{ position: 'absolute', left: '12px', top: '12px' }}
              />
              <input
                type="password"
                required
                className="input-control"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ paddingLeft: '38px' }}
              />
            </div>
          </div>

          {mode === 'register' && (
            <div style={{ marginBottom: '20px' }}>
              <label
                style={{
                  display: 'block',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  color: '#94a3b8',
                  marginBottom: '6px',
                }}
              >
                Role
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                <button
                  type="button"
                  onClick={() => setRole('VOTER')}
                  className="btn"
                  style={{
                    background: role === 'VOTER' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255, 255, 255, 0.04)',
                    border: `1px solid ${role === 'VOTER' ? '#10b981' : 'var(--border-subtle)'}`,
                    color: role === 'VOTER' ? '#34d399' : '#94a3b8',
                    padding: '8px',
                    fontSize: '0.85rem',
                  }}
                >
                  Voter (Citizen)
                </button>
                <button
                  type="button"
                  onClick={() => setRole('ADMIN')}
                  className="btn"
                  style={{
                    background: role === 'ADMIN' ? 'rgba(244, 63, 94, 0.2)' : 'rgba(255, 255, 255, 0.04)',
                    border: `1px solid ${role === 'ADMIN' ? '#f43f5e' : 'var(--border-subtle)'}`,
                    color: role === 'ADMIN' ? '#fb7185' : '#94a3b8',
                    padding: '8px',
                    fontSize: '0.85rem',
                  }}
                >
                  Admin (Manager)
                </button>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary"
            style={{ width: '100%', padding: '12px', marginTop: '8px' }}
          >
            {loading ? 'Authenticating...' : mode === 'login' ? 'Sign In' : 'Create Account'}
          </button>
        </form>
      </div>
    </div>
  );
};
