import React, { useState, useEffect } from 'react';
import { api } from '../api/apiClient';
import { useAuth } from '../context/AuthContext';
import { getCandidateColor, STATUS_COLORS } from '../utils/colors';
import {
  Vote,
  Calendar,
  Users,
  CheckCircle2,
  Clock,
  ArrowRight,
  TrendingUp,
  Award,
  Sparkles,
  AlertCircle,
} from 'lucide-react';

export const ElectionsView = ({ onSelectVote, onSelectResults, onOpenAuth, onToast }) => {
  const { isAuthenticated, isVoter } = useAuth();
  const [elections, setElections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL'); // ALL, ACTIVE, DRAFT, CLOSED
  const [userVoteStatus, setUserVoteStatus] = useState({}); // { [electionId]: { hasVoted: boolean } }

  const loadElections = async () => {
    setLoading(true);
    try {
      const data = await api.getElections();
      setElections(data || []);

      // If user is authenticated, check their vote status for each election
      if (isAuthenticated && data?.length) {
        checkStatuses(data);
      }
    } catch (err) {
      console.error('Failed to load elections:', err);
    } finally {
      setLoading(false);
    }
  };

  const checkStatuses = async (electionsList) => {
    const statuses = {};
    for (const el of electionsList) {
      try {
        const res = await api.getVoteStatus(el.id);
        statuses[el.id] = res;
      } catch (e) {
        // user might not be logged in or error
      }
    }
    setUserVoteStatus(statuses);
  };

  useEffect(() => {
    loadElections();
  }, [isAuthenticated]);

  const filteredElections = elections.filter((el) => {
    if (filter === 'ALL') return true;
    return el.status === filter;
  });

  const activeCount = elections.filter((e) => e.status === 'ACTIVE').length;
  const totalCandidates = elections.reduce((acc, el) => acc + (el.candidates?.length || 0), 0);
  const votedCount = Object.values(userVoteStatus).filter((s) => s.hasVoted).length;

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '32px 24px' }}>
      {/* Top Banner / Metrics Overview */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '16px',
          marginBottom: '32px',
        }}
      >
        <div className="glass-panel" style={{ padding: '20px', borderLeft: '4px solid #6366f1' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase' }}>
              Total Elections
            </span>
            <Vote size={20} color="#6366f1" />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#f8fafc', marginTop: '6px' }}>
            {elections.length}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '2px' }}>
            Registered on the platform
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '20px', borderLeft: '4px solid #10b981' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase' }}>
              Active Balloting
            </span>
            <TrendingUp size={20} color="#10b981" />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#34d399', marginTop: '6px' }}>
            {activeCount}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '2px' }}>
            Open for verified voter ballots
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '20px', borderLeft: '4px solid #06b6d4' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase' }}>
              Candidates
            </span>
            <Users size={20} color="#06b6d4" />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#38bdf8', marginTop: '6px' }}>
            {totalCandidates}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '2px' }}>
            Vying across active races
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '20px', borderLeft: '4px solid #f59e0b' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase' }}>
              My Ballots Cast
            </span>
            <CheckCircle2 size={20} color="#f59e0b" />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#fbbf24', marginTop: '6px' }}>
            {isAuthenticated ? votedCount : '—'}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '2px' }}>
            {isAuthenticated ? 'Cryptographically sealed' : 'Sign in to check'}
          </div>
        </div>
      </div>

      {/* Filter Tabs & Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '24px',
          flexWrap: 'wrap',
          gap: '16px',
        }}
      >
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#f8fafc' }}>
            Elections & Voting Ledger
          </h2>
          <p style={{ fontSize: '0.875rem', color: '#94a3b8' }}>
            Browse active elections, inspect official candidates, and cast your anonymous vote.
          </p>
        </div>

        {/* Filter Pills */}
        <div
          style={{
            display: 'flex',
            gap: '6px',
            background: 'rgba(15, 23, 42, 0.8)',
            padding: '4px',
            borderRadius: '12px',
            border: '1px solid var(--border-subtle)',
          }}
        >
          {['ALL', 'ACTIVE', 'DRAFT', 'CLOSED'].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className="btn btn-ghost"
              style={{
                padding: '6px 14px',
                fontSize: '0.8rem',
                borderRadius: '8px',
                background: filter === tab ? 'var(--grad-primary)' : 'transparent',
                color: filter === tab ? '#ffffff' : '#94a3b8',
                fontWeight: filter === tab ? 700 : 500,
              }}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Elections Cards Grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: '#94a3b8' }}>
          <Sparkles className="animate-spin" size={32} color="#6366f1" style={{ margin: '0 auto 12px' }} />
          <div>Syncing elections through API Gateway...</div>
        </div>
      ) : filteredElections.length === 0 ? (
        <div
          className="glass-panel"
          style={{
            textAlign: 'center',
            padding: '48px 24px',
            color: '#94a3b8',
          }}
        >
          <AlertCircle size={36} color="#64748b" style={{ margin: '0 auto 12px' }} />
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#e2e8f0', marginBottom: '4px' }}>
            No elections found
          </h3>
          <p style={{ fontSize: '0.85rem' }}>
            {filter === 'ALL'
              ? 'No elections have been created yet. Log in as Admin to create one!'
              : `No elections match the filter "${filter}".`}
          </p>
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))',
            gap: '20px',
          }}
        >
          {filteredElections.map((election) => {
            const statusConfig = STATUS_COLORS[election.status] || STATUS_COLORS.DRAFT;
            const hasVoted = userVoteStatus[election.id]?.hasVoted;
            const isActive = election.status === 'ACTIVE';

            return (
              <div
                key={election.id}
                className="glass-panel glow-card"
                style={{
                  padding: '24px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  '--card-accent': statusConfig.dot,
                }}
              >
                <div>
                  {/* Status & ID Header */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: '12px',
                    }}
                  >
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '4px 10px',
                        borderRadius: '9999px',
                        background: statusConfig.bg,
                        border: `1px solid ${statusConfig.border}`,
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        color: statusConfig.text,
                      }}
                    >
                      <span
                        style={{
                          width: '6px',
                          height: '6px',
                          borderRadius: '50%',
                          background: statusConfig.dot,
                          boxShadow: isActive ? `0 0 6px ${statusConfig.dot}` : 'none',
                        }}
                      />
                      {statusConfig.label}
                    </span>

                    <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>
                      ID #{election.id}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <h3
                    style={{
                      fontSize: '1.2rem',
                      fontWeight: 800,
                      color: '#ffffff',
                      marginBottom: '8px',
                      lineHeight: '1.3',
                    }}
                  >
                    {election.title}
                  </h3>
                  <p
                    style={{
                      fontSize: '0.85rem',
                      color: '#94a3b8',
                      marginBottom: '16px',
                      lineHeight: '1.5',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}
                  >
                    {election.description || 'No description provided.'}
                  </p>

                  {/* Candidates Preview Chips */}
                  <div style={{ marginBottom: '18px' }}>
                    <div
                      style={{
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        color: '#64748b',
                        marginBottom: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                      }}
                    >
                      <Users size={12} />
                      <span>{election.candidates?.length || 0} Candidates</span>
                    </div>

                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                      {election.candidates?.map((c, idx) => {
                        const color = getCandidateColor(c.id || idx);
                        return (
                          <div
                            key={c.id}
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '6px',
                              padding: '4px 10px',
                              borderRadius: '8px',
                              background: color.bg,
                              border: `1px solid ${color.border}`,
                              fontSize: '0.8rem',
                              color: '#f8fafc',
                            }}
                          >
                            <span
                              style={{
                                width: '8px',
                                height: '8px',
                                borderRadius: '50%',
                                background: color.accent,
                              }}
                            />
                            <span style={{ fontWeight: 600 }}>{c.name}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Dates */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      fontSize: '0.75rem',
                      color: '#64748b',
                      padding: '8px 12px',
                      background: 'rgba(0, 0, 0, 0.25)',
                      borderRadius: '8px',
                      marginBottom: '20px',
                    }}
                  >
                    <Calendar size={13} color="#94a3b8" />
                    <span>
                      {election.startDate
                        ? new Date(election.startDate).toLocaleDateString()
                        : 'Immediate'}{' '}
                      —{' '}
                      {election.endDate
                        ? new Date(election.endDate).toLocaleDateString()
                        : 'Indefinite'}
                    </span>
                  </div>
                </div>

                {/* Card Actions */}
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  {hasVoted ? (
                    <div
                      style={{
                        flex: 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                        padding: '10px',
                        borderRadius: '10px',
                        background: 'rgba(16, 185, 129, 0.12)',
                        border: '1px solid rgba(16, 185, 129, 0.3)',
                        color: '#34d399',
                        fontSize: '0.85rem',
                        fontWeight: 700,
                      }}
                    >
                      <CheckCircle2 size={16} />
                      <span>Ballot Sealed</span>
                    </div>
                  ) : isActive ? (
                    isAuthenticated ? (
                      <button
                        type="button"
                        onClick={() => onSelectVote(election)}
                        className="btn btn-emerald"
                        style={{ flex: 1, padding: '10px' }}
                      >
                        <Vote size={16} />
                        <span>Cast Ballot</span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => onOpenAuth('login')}
                        className="btn btn-primary"
                        style={{ flex: 1, padding: '10px' }}
                      >
                        <span>Sign in to Vote</span>
                      </button>
                    )
                  ) : (
                    <div
                      style={{
                        flex: 1,
                        textAlign: 'center',
                        padding: '10px',
                        fontSize: '0.85rem',
                        color: '#64748b',
                        background: 'rgba(255, 255, 255, 0.03)',
                        borderRadius: '10px',
                      }}
                    >
                      {election.status === 'CLOSED' ? 'Voting Concluded' : 'Pending Activation'}
                    </div>
                  )}

                  {/* Live Results Button */}
                  <button
                    type="button"
                    onClick={() => onSelectResults(election.id)}
                    className="btn btn-outline"
                    title="View Live Results"
                    style={{ padding: '10px 14px' }}
                  >
                    <Award size={16} color="#a855f7" />
                    <span>Results</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
