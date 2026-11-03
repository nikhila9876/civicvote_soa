import React, { useState } from 'react';
import { api } from '../api/apiClient';
import { getCandidateColor } from '../utils/colors';
import {
  X,
  Vote,
  ShieldCheck,
  CheckCircle2,
  Copy,
  Check,
  Lock,
  ArrowRight,
  Fingerprint,
} from 'lucide-react';

export const VoteModal = ({ election, isOpen, onClose, onVoteSuccess, onToast, onOpenAudit }) => {
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [receipt, setReceipt] = useState(null);
  const [copied, setCopied] = useState(false);

  if (!isOpen || !election) return null;

  const handleCastVote = async () => {
    if (!selectedCandidate) {
      setError('Please select a candidate before casting your ballot.');
      return;
    }
    setError(null);
    setLoading(true);

    try {
      const response = await api.castVote({
        electionId: election.id,
        candidateId: selectedCandidate.id,
      });
      setReceipt(response);
      onVoteSuccess(election.id);
      onToast({
        type: 'success',
        title: 'Ballot Sealed & Cast!',
        message: 'Your anonymous ballot has been cryptographically recorded.',
      });
    } catch (err) {
      if (err.status === 409 || err.message?.includes('already voted')) {
        setError('Duplicate Vote Rejected: You have already cast a ballot in this election.');
      } else {
        setError(err.message || 'Failed to submit vote. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const copyHash = () => {
    if (receipt?.integrityHash) {
      navigator.clipboard.writeText(receipt.integrityHash);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleClose = () => {
    setSelectedCandidate(null);
    setError(null);
    setReceipt(null);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div
        className="modal-content"
        style={{ maxWidth: '580px' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div
          style={{
            padding: '20px 24px',
            borderBottom: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                background: 'var(--grad-emerald)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Vote size={20} color="#ffffff" />
            </div>
            <div>
              <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#f8fafc' }}>
                {receipt ? 'Official Voting Receipt' : 'Cast Your Anonymous Ballot'}
              </div>
              <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>{election.title}</div>
            </div>
          </div>
          <button
            onClick={handleClose}
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

        {/* Modal Body */}
        <div style={{ padding: '24px' }}>
          {receipt ? (
            /* Vote Receipt Confirmation View */
            <div>
              <div
                style={{
                  textAlign: 'center',
                  padding: '16px 0 24px',
                }}
              >
                <div
                  style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '50%',
                    background: 'rgba(16, 185, 129, 0.15)',
                    border: '2px solid #10b981',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 16px',
                    boxShadow: '0 0 25px rgba(16, 185, 129, 0.4)',
                  }}
                >
                  <CheckCircle2 size={36} color="#34d399" />
                </div>
                <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#ffffff', marginBottom: '6px' }}>
                  Vote Confirmed & Sealed
                </h3>
                <p style={{ fontSize: '0.875rem', color: '#94a3b8', maxWidth: '420px', margin: '0 auto' }}>
                  Your ballot was recorded anonymously. The cryptographic proof below guarantees ballot integrity against tampering.
                </p>
              </div>

              {/* Receipt Details Card */}
              <div
                style={{
                  background: 'rgba(15, 23, 42, 0.9)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '14px',
                  padding: '18px',
                  marginBottom: '20px',
                }}
              >
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
                  <div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>
                      Ballot ID
                    </div>
                    <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#f8fafc' }}>
                      #{receipt.voteId}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>
                      Election ID
                    </div>
                    <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#f8fafc' }}>
                      #{receipt.electionId}
                    </div>
                  </div>
                </div>

                <div>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: '6px',
                    }}
                  >
                    <span style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>
                      SHA-256 Cryptographic Hash
                    </span>
                    <button
                      onClick={copyHash}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: copied ? '#34d399' : '#38bdf8',
                        fontSize: '0.75rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                      }}
                    >
                      {copied ? <Check size={12} /> : <Copy size={12} />}
                      <span>{copied ? 'Copied!' : 'Copy Hash'}</span>
                    </button>
                  </div>
                  <div
                    className="code-pill"
                    style={{
                      padding: '8px 12px',
                      fontSize: '0.75rem',
                      lineHeight: '1.4',
                      background: 'rgba(6, 182, 212, 0.08)',
                      borderColor: 'rgba(6, 182, 212, 0.25)',
                    }}
                  >
                    {receipt.integrityHash}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => {
                    handleClose();
                    if (onOpenAudit) onOpenAudit();
                  }}
                  className="btn btn-outline"
                  style={{ flex: 1, borderColor: 'rgba(6, 182, 212, 0.4)', color: '#38bdf8' }}
                >
                  <Fingerprint size={16} />
                  <span>Verify in Audit</span>
                </button>
                <button
                  type="button"
                  onClick={handleClose}
                  className="btn btn-emerald"
                  style={{ flex: 1 }}
                >
                  <span>Done</span>
                </button>
              </div>
            </div>
          ) : (
            /* Candidate Selection View */
            <div>
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
                  }}
                >
                  {error}
                </div>
              )}

              <div style={{ marginBottom: '16px' }}>
                <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#e2e8f0', marginBottom: '8px' }}>
                  Select Candidate:
                </div>

                {(!election.candidates || election.candidates.length === 0) ? (
                  <div
                    style={{
                      padding: '24px',
                      textAlign: 'center',
                      background: 'rgba(255, 255, 255, 0.02)',
                      borderRadius: '12px',
                      color: '#64748b',
                    }}
                  >
                    No candidates registered in this election yet.
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {election.candidates.map((cand, idx) => {
                      const palette = getCandidateColor(cand.id || idx);
                      const isSelected = selectedCandidate?.id === cand.id;

                      return (
                        <div
                          key={cand.id}
                          onClick={() => setSelectedCandidate(cand)}
                          style={{
                            padding: '14px 16px',
                            borderRadius: '12px',
                            background: isSelected ? palette.bg : 'rgba(255, 255, 255, 0.03)',
                            border: `2px solid ${isSelected ? palette.accent : 'rgba(255, 255, 255, 0.08)'}`,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            transition: 'all 0.2s ease',
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                            <div
                              style={{
                                width: '40px',
                                height: '40px',
                                borderRadius: '10px',
                                background: palette.gradient,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: '#ffffff',
                                fontWeight: 800,
                                fontSize: '1rem',
                                boxShadow: `0 4px 12px ${palette.border}`,
                              }}
                            >
                              {cand.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#f8fafc' }}>
                                {cand.name}
                              </div>
                              <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                                {cand.description || 'Official Candidate'}
                              </div>
                            </div>
                          </div>

                          <div
                            style={{
                              width: '20px',
                              height: '20px',
                              borderRadius: '50%',
                              border: `2px solid ${isSelected ? palette.accent : '#64748b'}`,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              background: isSelected ? palette.accent : 'transparent',
                            }}
                          >
                            {isSelected && <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#fff' }} />}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Anonymous Integrity Banner */}
              <div
                style={{
                  background: 'rgba(6, 182, 212, 0.08)',
                  border: '1px solid rgba(6, 182, 212, 0.25)',
                  borderRadius: '12px',
                  padding: '12px 16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  marginBottom: '20px',
                }}
              >
                <Lock size={18} color="#38bdf8" />
                <div style={{ fontSize: '0.78rem', color: '#bae6fd', lineHeight: '1.4' }}>
                  <strong>Zero-Knowledge Voting:</strong> Your identity is decoupled from this ballot. Only the computed SHA-256 cryptographic hash is stored on the ledger.
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="button"
                onClick={handleCastVote}
                disabled={loading || !selectedCandidate}
                className="btn btn-emerald"
                style={{
                  width: '100%',
                  padding: '13px',
                  fontSize: '0.95rem',
                  opacity: (!selectedCandidate || loading) ? 0.6 : 1,
                  cursor: (!selectedCandidate || loading) ? 'not-allowed' : 'pointer',
                }}
              >
                {loading ? 'Sealing Cryptographic Ballot...' : 'Cast Anonymous Ballot'}
                {!loading && <ArrowRight size={16} />}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
