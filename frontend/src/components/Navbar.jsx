import React from 'react';
import { useAuth } from '../context/AuthContext';
import {
  Vote,
  BarChart3,
  ShieldCheck,
  Settings,
  Server,
  LogOut,
  UserCheck,
  LogIn,
  UserPlus,
  Zap,
} from 'lucide-react';

export const Navbar = ({ activeTab, setActiveTab, onOpenAuth, backendHealthy }) => {
  const { user, isAuthenticated, isAdmin, logout, quickLogin } = useAuth();

  const navItems = [
    { id: 'elections', label: 'Elections', icon: Vote, color: '#10b981' },
    { id: 'results', label: 'Live Results', icon: BarChart3, color: '#a855f7' },
    { id: 'audit', label: 'Audit Trail', icon: ShieldCheck, color: '#06b6d4' },
    { id: 'admin', label: 'Admin Console', icon: Settings, color: '#f43f5e', adminOnly: true },
    { id: 'architecture', label: 'Architecture', icon: Server, color: '#6366f1' },
  ];

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        background: 'rgba(10, 13, 20, 0.85)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid var(--border-subtle)',
        padding: '12px 24px',
      }}
    >
      <div
        style={{
          maxWidth: '1280px',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px',
          flexWrap: 'wrap',
        }}
      >
        {/* Brand */}
        <div
          onClick={() => setActiveTab('elections')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            cursor: 'pointer',
          }}
        >
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '12px',
              background: 'var(--grad-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 15px rgba(99, 102, 241, 0.4)',
            }}
          >
            <ShieldCheck size={24} color="#ffffff" />
          </div>
          <div>
            <div
              style={{
                fontSize: '1.25rem',
                fontWeight: 800,
                letterSpacing: '-0.02em',
                background: 'linear-gradient(135deg, #ffffff 40%, #a5b4fc 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              CivicVote
            </div>
            <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 500 }}>
              Tamper-Resistant Digital Election System
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
          {navItems.map((item) => {
            if (item.adminOnly && !isAdmin) return null;
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`btn ${isActive ? 'btn-outline' : 'btn-ghost'}`}
                style={{
                  padding: '8px 14px',
                  borderRadius: '10px',
                  fontSize: '0.85rem',
                  borderColor: isActive ? item.color : 'transparent',
                  background: isActive ? `${item.color}15` : 'transparent',
                  color: isActive ? '#ffffff' : '#94a3b8',
                }}
              >
                <Icon size={16} color={isActive ? item.color : '#94a3b8'} />
                <span>{item.label}</span>
                {item.adminOnly && (
                  <span
                    style={{
                      background: 'rgba(244, 63, 94, 0.2)',
                      color: '#fb7185',
                      fontSize: '0.65rem',
                      padding: '2px 6px',
                      borderRadius: '4px',
                      fontWeight: 700,
                    }}
                  >
                    ADMIN
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Right Section: System Health + Auth */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* Health Indicator */}
          <div
            title={`Backend Status: ${backendHealthy ? 'Connected to Gateway (:8080)' : 'Connecting / Offline'}`}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              borderRadius: '9999px',
              background: backendHealthy ? 'rgba(16, 185, 129, 0.1)' : 'rgba(244, 63, 94, 0.1)',
              border: `1px solid ${backendHealthy ? 'rgba(16, 185, 129, 0.3)' : 'rgba(244, 63, 94, 0.3)'}`,
              fontSize: '0.75rem',
              fontWeight: 600,
              color: backendHealthy ? '#34d399' : '#fb7185',
            }}
          >
            <span
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: backendHealthy ? '#10b981' : '#f43f5e',
                boxShadow: `0 0 8px ${backendHealthy ? '#10b981' : '#f43f5e'}`,
              }}
            />
            <span>{backendHealthy ? 'Gateway Live :8080' : 'Backend Connecting'}</span>
          </div>

          {/* User Profile or Login */}
          {isAuthenticated ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  padding: '6px 12px',
                  borderRadius: '10px',
                  border: '1px solid var(--border-subtle)',
                }}
              >
                <UserCheck size={16} color={isAdmin ? '#fb7185' : '#34d399'} />
                <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#f8fafc' }}>
                  {user.username}
                </span>
                <span className={isAdmin ? 'badge badge-rose' : 'badge badge-emerald'}>
                  {user.role}
                </span>
              </div>
              <button
                onClick={logout}
                title="Log Out"
                className="btn btn-outline"
                style={{ padding: '8px 12px' }}
              >
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {/* Demo 1-Click Login Pills */}
              <div style={{ display: 'flex', gap: '4px' }}>
                <button
                  onClick={() => quickLogin('ADMIN')}
                  className="btn btn-outline"
                  title="Log in as admin_user"
                  style={{
                    padding: '6px 10px',
                    fontSize: '0.75rem',
                    borderColor: 'rgba(244, 63, 94, 0.3)',
                    color: '#fb7185',
                  }}
                >
                  <Zap size={13} />
                  <span>Demo Admin</span>
                </button>
                <button
                  onClick={() => quickLogin('VOTER')}
                  className="btn btn-outline"
                  title="Log in as voter_john"
                  style={{
                    padding: '6px 10px',
                    fontSize: '0.75rem',
                    borderColor: 'rgba(16, 185, 129, 0.3)',
                    color: '#34d399',
                  }}
                >
                  <Zap size={13} />
                  <span>Demo Voter</span>
                </button>
              </div>

              <button
                onClick={() => onOpenAuth('login')}
                className="btn btn-primary"
                style={{ padding: '8px 14px', fontSize: '0.85rem' }}
              >
                <LogIn size={15} />
                <span>Log In</span>
              </button>
              <button
                onClick={() => onOpenAuth('register')}
                className="btn btn-outline"
                style={{ padding: '8px 14px', fontSize: '0.85rem' }}
              >
                <UserPlus size={15} />
                <span>Sign Up</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
