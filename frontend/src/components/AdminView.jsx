import React, { useState, useEffect } from 'react';
import { api } from '../api/apiClient';
import { useAuth } from '../context/AuthContext';
import { getCandidateColor, STATUS_COLORS } from '../utils/colors';
import {
  Settings,
  PlusCircle,
  Play,
  StopCircle,
  Trash2,
  UserPlus,
  RefreshCw,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  Lock,
  Zap,
} from 'lucide-react';

export const AdminView = ({ onToast }) => {
  const { isAdmin, quickLogin } = useAuth();
  const [elections, setElections] = useState([]);
  const [loading, setLoading] = useState(true);

  // New election form states
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [creating, setCreating] = useState(false);

  // Add Candidate Modal state
  const [candidateModalElection, setCandidateModalElection] = useState(null);
  const [candidateName, setCandidateName] = useState('');
  const [candidateDesc, setCandidateDesc] = useState('');
  const [addingCandidate, setAddingCandidate] = useState(false);

  const loadElections = async () => {
    setLoading(true);
    try {
      const data = await api.getElections();
      setElections(data || []);
    } catch (err) {
      console.error('Failed to load elections:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      loadElections();
    }
  }, [isAdmin]);

  const handleCreateElection = async (e) => {
    e.preventDefault();
    if (!title) return;
    setCreating(true);

    try {
      // Default dates if omitted
      const now = new Date();
      const nextMonth = new Date();
      nextMonth.setDate(now.getDate() + 30);

      const start = startDate ? new Date(startDate).toISOString().replace('Z', '') : now.toISOString().replace('Z', '');
      const end = endDate ? new Date(endDate).toISOString().replace('Z', '') : nextMonth.toISOString().replace('Z', '');

      const payload = {
        title,
        description,
        startDate: start,
        endDate: end,
      };

      const created = await api.createElection(payload);
      onToast({
        type: 'success',
        title: 'Election Created',
        message: `Created "${created.title}" with ID #${created.id}`,
      });
      setTitle('');
      setDescription('');
      setStartDate('');
      setEndDate('');
      loadElections();
    } catch (err) {
      onToast({
        type: 'error',
        title: 'Creation Failed',
        message: err.message || 'Failed to create election.',
      });
    } finally {
      setCreating(false);
    }
  };

  const handleActivate = async (id) => {
    try {
      await api.activateElection(id);
      onToast({
        type: 'success',
        title: 'Election Activated',
        message: `Election #${id} is now open for voting.`,
      });
      loadElections();
    } catch (err) {
      onToast({
        type: 'error',
        title: 'Activation Failed',
        message: err.message,
      });
    }
  };

  const handleClose = async (id) => {
    try {
      await api.closeElection(id);
      onToast({
        type: 'info',
        title: 'Election Closed',
        message: `Election #${id} has concluded.`,
      });
      loadElections();
    } catch (err) {
      onToast({
        type: 'error',
        title: 'Closure Failed',
        message: err.message,
      });
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm(`Are you sure you want to delete Election #${id}?`)) return;
    try {
      await api.deleteElection(id);
      onToast({
        type: 'info',
        title: 'Election Removed',
        message: `Deleted election #${id}.`,
      });
      loadElections();
    } catch (err) {
      onToast({
        type: 'error',
        title: 'Delete Failed',
        message: err.message,
      });
    }
  };

  const handleAddCandidate = async (e) => {
    e.preventDefault();
    if (!candidateName || !candidateModalElection) return;
    setAddingCandidate(true);

    try {
      const added = await api.addCandidate(candidateModalElection.id, {
        name: candidateName,
        description: candidateDesc,
      });
      onToast({
        type: 'success',
        title: 'Candidate Registered',
        message: `Added ${added.name} to Election #${candidateModalElection.id}`,
      });
      setCandidateName('');
      setCandidateDesc('');
      setCandidateModalElection(null);
      loadElections();
    } catch (err) {
      onToast({
        type: 'error',
        title: 'Candidate Registration Failed',
        message: err.message,
      });
    } finally {
      setAddingCandidate(false);
    }
  };

  if (!isAdmin) {
    return (
      <div style={{ maxWidth: '640px', margin: '60px auto', padding: '0 24px', textAlign: 'center' }}>
        <div className="glass-panel" style={{ padding: '40px' }}>
          <Lock size={48} color="#fb7185" style={{ margin: '0 auto 16px' }} />
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#ffffff', marginBottom: '8px' }}>
            Administrator Access Required
          </h2>
          <p style={{ fontSize: '0.9rem', color: '#94a3b8', marginBottom: '24px' }}>
            The Election Administration Console is restricted to users with the <code>ADMIN</code> role.
          </p>
          <button
            type="button"
            onClick={() => quickLogin('ADMIN')}
            className="btn btn-primary"
            style={{ padding: '12px 24px', fontSize: '0.95rem' }}
          >
            <Zap size={16} />
            <span>Switch to Demo Admin</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '32px 24px' }}>
      {/* Header */}
      <div style={{ marginBottom: '28px' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Settings color="#f43f5e" size={26} />
          <span>Election Administration Console</span>
        </h2>
        <p style={{ fontSize: '0.875rem', color: '#94a3b8' }}>
          Create elections, manage candidate rosters, control voting lifecycles, and force result recalculations.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: '28px' }}>
        {/* Create Election Card */}
        <div className="glass-panel" style={{ padding: '24px', height: 'fit-content' }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#ffffff', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <PlusCircle size={20} color="#10b981" />
            <span>Create New Election</span>
          </h3>

          <form onSubmit={handleCreateElection}>
            <div style={{ marginBottom: '14px' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#94a3b8', marginBottom: '6px' }}>
                Election Title *
              </label>
              <input
                type="text"
                required
                className="input-control"
                placeholder="e.g. 2026 Student Council Election"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div style={{ marginBottom: '14px' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#94a3b8', marginBottom: '6px' }}>
                Description
              </label>
              <textarea
                rows={3}
                className="input-control"
                placeholder="Details, eligibility criteria, or rules"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                style={{ resize: 'vertical' }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#94a3b8', marginBottom: '6px' }}>
                  Start Date
                </label>
                <input
                  type="datetime-local"
                  className="input-control"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#94a3b8', marginBottom: '6px' }}>
                  End Date
                </label>
                <input
                  type="datetime-local"
                  className="input-control"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={creating}
              className="btn btn-emerald"
              style={{ width: '100%', padding: '12px' }}
            >
              {creating ? 'Creating Election...' : 'Create Election (Draft)'}
            </button>
          </form>
        </div>

        {/* Existing Elections List */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#ffffff' }}>
              Managed Elections ({elections.length})
            </h3>
            <button
              onClick={loadElections}
              className="btn btn-outline"
              style={{ padding: '6px 12px', fontSize: '0.8rem' }}
            >
              <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
              <span>Refresh</span>
            </button>
          </div>

          {loading ? (
            <div style={{ padding: '40px', textAlign: 'center', color: '#94a3b8' }}>Loading elections...</div>
          ) : elections.length === 0 ? (
            <div className="glass-panel" style={{ padding: '32px', textAlign: 'center', color: '#94a3b8' }}>
              No elections found. Create your first election using the form on the left.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {elections.map((el) => {
                const statusStyle = STATUS_COLORS[el.status] || STATUS_COLORS.DRAFT;

                return (
                  <div
                    key={el.id}
                    className="glass-panel"
                    style={{
                      padding: '18px 20px',
                      borderLeft: `4px solid ${statusStyle.dot}`,
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                          <span style={{ fontWeight: 800, fontSize: '1.05rem', color: '#f8fafc' }}>
                            {el.title}
                          </span>
                          <span
                            style={{
                              fontSize: '0.7rem',
                              padding: '2px 8px',
                              borderRadius: '9999px',
                              background: statusStyle.bg,
                              color: statusStyle.text,
                              fontWeight: 700,
                              border: `1px solid ${statusStyle.border}`,
                            }}
                          >
                            {el.status}
                          </span>
                        </div>
                        <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                          ID #{el.id} • {el.candidates?.length || 0} candidates
                        </div>
                      </div>

                      {/* Delete button */}
                      <button
                        onClick={() => handleDelete(el.id)}
                        className="btn btn-ghost"
                        title="Delete Election"
                        style={{ color: '#fb7185', padding: '6px' }}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>

                    {/* Candidate Avatars */}
                    {el.candidates && el.candidates.length > 0 && (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', margin: '10px 0' }}>
                        {el.candidates.map((c, idx) => {
                          const pal = getCandidateColor(c.id || idx);
                          return (
                            <span
                              key={c.id}
                              style={{
                                fontSize: '0.75rem',
                                padding: '2px 8px',
                                borderRadius: '6px',
                                background: pal.bg,
                                color: pal.text,
                                border: `1px solid ${pal.border}`,
                              }}
                            >
                              {c.name}
                            </span>
                          );
                        })}
                      </div>
                    )}

                    {/* Lifecycle action buttons */}
                    <div style={{ display: 'flex', gap: '8px', marginTop: '12px', flexWrap: 'wrap' }}>
                      <button
                        onClick={() => setCandidateModalElection(el)}
                        className="btn btn-outline"
                        style={{ fontSize: '0.78rem', padding: '6px 12px' }}
                      >
                        <UserPlus size={14} color="#38bdf8" />
                        <span>Add Candidate</span>
                      </button>

                      {el.status !== 'ACTIVE' && el.status !== 'CLOSED' && (
                        <button
                          onClick={() => handleActivate(el.id)}
                          className="btn btn-emerald"
                          style={{ fontSize: '0.78rem', padding: '6px 12px' }}
                        >
                          <Play size={14} />
                          <span>Activate</span>
                        </button>
                      )}

                      {el.status === 'ACTIVE' && (
                        <button
                          onClick={() => handleClose(el.id)}
                          className="btn btn-rose"
                          style={{ fontSize: '0.78rem', padding: '6px 12px' }}
                        >
                          <StopCircle size={14} />
                          <span>Close Election</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Modal: Add Candidate */}
      {candidateModalElection && (
        <div className="modal-overlay" onClick={() => setCandidateModalElection(null)}>
          <div
            className="modal-content"
            style={{ maxWidth: '440px' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                padding: '18px 24px',
                borderBottom: '1px solid var(--border-subtle)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#ffffff' }}>
                Add Candidate to #{candidateModalElection.id}
              </h3>
              <button
                onClick={() => setCandidateModalElection(null)}
                style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddCandidate} style={{ padding: '20px 24px' }}>
              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#94a3b8', marginBottom: '6px' }}>
                  Candidate Full Name *
                </label>
                <input
                  type="text"
                  required
                  className="input-control"
                  placeholder="e.g. Alice Johnson"
                  value={candidateName}
                  onChange={(e) => setCandidateName(e.target.value)}
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#94a3b8', marginBottom: '6px' }}>
                  Manifesto / Description
                </label>
                <textarea
                  rows={3}
                  className="input-control"
                  placeholder="e.g. Tech and Innovation Representative"
                  value={candidateDesc}
                  onChange={(e) => setCandidateDesc(e.target.value)}
                />
              </div>

              <button
                type="submit"
                disabled={addingCandidate}
                className="btn btn-primary"
                style={{ width: '100%', padding: '12px' }}
              >
                {addingCandidate ? 'Registering...' : 'Add Candidate'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
