import React, { useState, useEffect } from 'react';
import { api } from '../api/apiClient';
import { useAuth } from '../context/AuthContext';
import { getCandidateColor } from '../utils/colors';
import confetti from 'canvas-confetti';
import {
  BarChart3,
  Trophy,
  RefreshCw,
  Users,
  Vote,
  Sparkles,
  TrendingUp,
  AlertCircle,
  Play,
  RotateCw,
} from 'lucide-react';

export const ResultsView = ({ selectedElectionId, onToast }) => {
  const { isAdmin } = useAuth();
  const [elections, setElections] = useState([]);
  const [currentElectionId, setCurrentElectionId] = useState(selectedElectionId || null);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [calculating, setCalculating] = useState(false);

  // Load elections dropdown
  useEffect(() => {
    api.getElections().then((data) => {
      setElections(data || []);
      if (!currentElectionId && data?.length) {
        // default to first active or first election
        const active = data.find((e) => e.status === 'ACTIVE') || data[0];
        setCurrentElectionId(active.id);
      }
    });
  }, []);

  // Update currentElectionId if prop changes
  useEffect(() => {
    if (selectedElectionId) {
      setCurrentElectionId(selectedElectionId);
    }
  }, [selectedElectionId]);

  // Fetch results summary for the election
  const fetchSummary = async (isManual = false) => {
    if (!currentElectionId) return;
    if (isManual) setLoading(true);

    try {
      const data = await api.getSummary(currentElectionId);
      setSummary(data);

      if (isManual && data?.winner && data?.totalVotes > 0) {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
      }
    } catch (err) {
      console.error('Failed to load results:', err);
    } finally {
      if (isManual) setLoading(false);
    }
  };

  useEffect(() => {
    fetchSummary(true);
  }, [currentElectionId]);

  // Auto-refresh interval
  useEffect(() => {
    if (!autoRefresh || !currentElectionId) return;
    const interval = setInterval(() => {
      fetchSummary(false);
    }, 4000);
    return () => clearInterval(interval);
  }, [autoRefresh, currentElectionId]);

  // Admin trigger recalculation
  const handleRecalculate = async () => {
    if (!currentElectionId) return;
    setCalculating(true);
    try {
      await api.calculateResults(currentElectionId);
      await fetchSummary(true);
      onToast({
        type: 'success',
        title: 'Results Recomputed',
        message: 'Aggregated vote totals updated directly from voting service ledger.',
      });
    } catch (err) {
      onToast({
        type: 'error',
        title: 'Calculation Error',
        message: err.message || 'Failed to trigger result recalculation.',
      });
    } finally {
      setCalculating(false);
    }
  };

  const selectedElection = elections.find((e) => e.id === Number(currentElectionId));
  const totalVotes = summary?.totalVotes || 0;

  // Sort candidate results in descending order
  const sortedResults = [...(summary?.results || [])].sort((a, b) => b.voteCount - a.voteCount);

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '32px 24px' }}>
      {/* View Header with Controls */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '28px',
          flexWrap: 'wrap',
          gap: '16px',
        }}
      >
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <BarChart3 color="#a855f7" size={26} />
            <span>Live Election Results & Auditing</span>
          </h2>
          <p style={{ fontSize: '0.875rem', color: '#94a3b8' }}>
            Real-time vote aggregation streamed from the CivicVote microservices cluster.
          </p>
        </div>

        {/* Action Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          {/* Election Selector Dropdown */}
          <select
            className="input-control"
            value={currentElectionId || ''}
            onChange={(e) => setCurrentElectionId(Number(e.target.value))}
            style={{ width: 'auto', minWidth: '220px', cursor: 'pointer' }}
          >
            {elections.map((el) => (
              <option key={el.id} value={el.id} style={{ background: '#111827' }}>
                #{el.id} - {el.title} ({el.status})
              </option>
            ))}
          </select>

          {/* Auto Refresh Toggle */}
          <button
            onClick={() => setAutoRefresh(!autoRefresh)}
            className="btn btn-outline"
            style={{
              padding: '9px 14px',
              fontSize: '0.8rem',
              borderColor: autoRefresh ? 'rgba(16, 185, 129, 0.4)' : 'var(--border-subtle)',
              color: autoRefresh ? '#34d399' : '#94a3b8',
            }}
          >
            <span
              style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                background: autoRefresh ? '#10b981' : '#64748b',
                boxShadow: autoRefresh ? '0 0 6px #10b981' : 'none',
              }}
            />
            <span>{autoRefresh ? 'Live Polling (4s)' : 'Polling Paused'}</span>
          </button>

          {/* Manual Refresh Button */}
          <button
            onClick={() => fetchSummary(true)}
            className="btn btn-outline"
            disabled={loading}
            style={{ padding: '9px 12px' }}
          >
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          </button>

          {/* Admin Recalculate Trigger */}
          {isAdmin && (
            <button
              onClick={handleRecalculate}
              disabled={calculating}
              className="btn btn-rose"
              style={{ padding: '9px 14px', fontSize: '0.8rem' }}
            >
              <RotateCw size={14} className={calculating ? 'animate-spin' : ''} />
              <span>{calculating ? 'Calculating...' : 'Force Recalculate'}</span>
            </button>
          )}
        </div>
      </div>

      {!selectedElection ? (
        <div className="glass-panel" style={{ textAlign: 'center', padding: '60px 0', color: '#94a3b8' }}>
          <AlertCircle size={32} color="#64748b" style={{ margin: '0 auto 12px' }} />
          <div>Please select or create an election to view results.</div>
        </div>
      ) : (
        <div>
          {/* Winner Spotlight Card */}
          <div
            className="glass-panel"
            style={{
              padding: '28px',
              marginBottom: '28px',
              background: 'linear-gradient(135deg, rgba(30, 27, 75, 0.6) 0%, rgba(18, 24, 38, 0.9) 100%)',
              border: '1px solid rgba(168, 85, 247, 0.3)',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                position: 'absolute',
                top: '-30px',
                right: '-30px',
                width: '180px',
                height: '180px',
                background: 'radial-gradient(circle, rgba(168, 85, 247, 0.25) 0%, transparent 70%)',
                pointerEvents: 'none',
              }}
            />

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '20px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                <div
                  style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '16px',
                    background: 'var(--grad-gold)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 10px 25px rgba(245, 158, 11, 0.4)',
                  }}
                >
                  <Trophy size={34} color="#ffffff" />
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: '#fbbf24', letterSpacing: '0.05em' }}>
                    Leading Candidate / Projected Winner
                  </div>
                  <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#ffffff', lineHeight: '1.2', marginTop: '2px' }}>
                    {summary?.winner ? summary.winner : 'No Votes Recorded'}
                  </div>
                  <div style={{ fontSize: '0.85rem', color: '#94a3b8', marginTop: '4px' }}>
                    {summary?.winnerVotes ? `${summary.winnerVotes} votes in favor` : 'Awaiting citizens to cast their ballots'}
                  </div>
                </div>
              </div>

              {/* Total Votes Counter */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '24px',
                  background: 'rgba(0, 0, 0, 0.3)',
                  padding: '16px 24px',
                  borderRadius: '14px',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                }}
              >
                <div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>
                    Total Ballots Cast
                  </div>
                  <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#38bdf8' }}>
                    {totalVotes}
                  </div>
                </div>
                <div style={{ width: '1px', height: '40px', background: 'rgba(255, 255, 255, 0.1)' }} />
                <div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>
                    Election Status
                  </div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#34d399', textTransform: 'uppercase' }}>
                    {selectedElection.status}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Candidate Multi-Colour Progress Cards */}
          <div style={{ marginBottom: '32px' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#f8fafc', marginBottom: '16px' }}>
              Vote Share Distribution
            </h3>

            {sortedResults.length === 0 ? (
              <div className="glass-panel" style={{ padding: '32px', textAlign: 'center', color: '#94a3b8' }}>
                No candidate vote records available yet for this election.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {sortedResults.map((result, idx) => {
                  const palette = getCandidateColor(result.candidateId || idx);
                  const percentage = totalVotes > 0 ? ((result.voteCount / totalVotes) * 100).toFixed(1) : 0;
                  const isLeader = idx === 0 && result.voteCount > 0;

                  return (
                    <div
                      key={result.id || result.candidateId}
                      className="glass-panel"
                      style={{
                        padding: '18px 24px',
                        borderLeft: `4px solid ${palette.accent}`,
                        background: 'rgba(18, 24, 38, 0.85)',
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          marginBottom: '10px',
                          flexWrap: 'wrap',
                          gap: '10px',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <span
                            style={{
                              width: '28px',
                              height: '28px',
                              borderRadius: '8px',
                              background: isLeader ? 'var(--grad-gold)' : 'rgba(255, 255, 255, 0.08)',
                              color: '#ffffff',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '0.8rem',
                              fontWeight: 800,
                            }}
                          >
                            #{idx + 1}
                          </span>
                          <div>
                            <span style={{ fontWeight: 700, fontSize: '1.05rem', color: '#f8fafc' }}>
                              {result.candidateName || `Candidate ${result.candidateId}`}
                            </span>
                            {isLeader && (
                              <span
                                style={{
                                  marginLeft: '8px',
                                  fontSize: '0.7rem',
                                  background: 'rgba(245, 158, 11, 0.2)',
                                  color: '#fbbf24',
                                  padding: '2px 8px',
                                  borderRadius: '9999px',
                                  fontWeight: 700,
                                }}
                              >
                                LEADER
                              </span>
                            )}
                          </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                          <span style={{ fontSize: '1.1rem', fontWeight: 800, color: '#f8fafc' }}>
                            {result.voteCount} votes
                          </span>
                          <span
                            style={{
                              fontSize: '1rem',
                              fontWeight: 700,
                              color: palette.text,
                              minWidth: '55px',
                              textAlign: 'right',
                            }}
                          >
                            {percentage}%
                          </span>
                        </div>
                      </div>

                      {/* Animated Progress Bar */}
                      <div
                        style={{
                          width: '100%',
                          height: '10px',
                          background: 'rgba(255, 255, 255, 0.06)',
                          borderRadius: '9999px',
                          overflow: 'hidden',
                        }}
                      >
                        <div
                          style={{
                            width: `${percentage}%`,
                            height: '100%',
                            background: palette.gradient,
                            borderRadius: '9999px',
                            transition: 'width 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
                            boxShadow: `0 0 10px ${palette.accent}`,
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Detailed Tabular Breakdown */}
          <div className="glass-panel" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#f8fafc', marginBottom: '16px' }}>
              Detailed Ledger Breakdown
            </h3>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border-subtle)', color: '#64748b', fontSize: '0.75rem', textTransform: 'uppercase' }}>
                    <th style={{ padding: '12px 16px' }}>Rank</th>
                    <th style={{ padding: '12px 16px' }}>Candidate ID</th>
                    <th style={{ padding: '12px 16px' }}>Candidate Name</th>
                    <th style={{ padding: '12px 16px' }}>Votes Count</th>
                    <th style={{ padding: '12px 16px' }}>Share %</th>
                    <th style={{ padding: '12px 16px' }}>Last Audited</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedResults.map((r, i) => (
                    <tr key={r.id || r.candidateId} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.04)', fontSize: '0.875rem' }}>
                      <td style={{ padding: '14px 16px', fontWeight: 700, color: '#f8fafc' }}>#{i + 1}</td>
                      <td style={{ padding: '14px 16px', color: '#94a3b8' }}>#{r.candidateId}</td>
                      <td style={{ padding: '14px 16px', fontWeight: 600, color: '#f8fafc' }}>
                        {r.candidateName || `Candidate ${r.candidateId}`}
                      </td>
                      <td style={{ padding: '14px 16px', fontWeight: 700, color: '#38bdf8' }}>{r.voteCount}</td>
                      <td style={{ padding: '14px 16px', fontWeight: 700, color: '#34d399' }}>
                        {totalVotes > 0 ? ((r.voteCount / totalVotes) * 100).toFixed(1) : 0}%
                      </td>
                      <td style={{ padding: '14px 16px', color: '#64748b', fontSize: '0.8rem' }}>
                        {r.calculatedAt ? new Date(r.calculatedAt).toLocaleTimeString() : 'Real-time Feign'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
