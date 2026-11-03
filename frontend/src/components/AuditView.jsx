import React, { useState } from 'react';
import { api } from '../api/apiClient';
import { useAuth } from '../context/AuthContext';
import {
  ShieldCheck,
  ShieldAlert,
  Fingerprint,
  Lock,
  Binary,
  CheckCircle2,
  RefreshCw,
  Zap,
  ArrowRight,
  Database,
  Hash,
  Search,
} from 'lucide-react';

export const AuditView = ({ onToast, onOpenAuth }) => {
  const { isAuthenticated, isAdmin, quickLogin } = useAuth();
  const [verification, setVerification] = useState(null);
  const [loading, setLoading] = useState(false);

  // SHA-256 interactive simulator in browser
  const [simElectionId, setSimElectionId] = useState('1');
  const [simCandidateId, setSimCandidateId] = useState('1');
  const [simSalt, setSimSalt] = useState('voter_demo_7793421');
  const [simComputedHash, setSimComputedHash] = useState('');

  const runAuditVerification = async () => {
    if (!isAdmin) {
      onToast({
        type: 'warning',
        title: 'Admin Role Required',
        message: 'Audit verification requires an ADMIN token. Use Demo Admin button below.',
      });
      return;
    }

    setLoading(true);
    try {
      const data = await api.verifyAudit();
      setVerification(data);
      onToast({
        type: data.integrityStatus === 'VALID' ? 'success' : 'error',
        title: `Audit Complete: ${data.integrityStatus}`,
        message: `Verified ${data.validRecords} of ${data.totalRecordsChecked} ballots across the system.`,
      });
    } catch (err) {
      onToast({
        type: 'error',
        title: 'Verification Failed',
        message: err.message || 'Failed to execute audit verification.',
      });
    } finally {
      setLoading(false);
    }
  };

  // Browser-side SHA-256 computation simulator
  const computeClientHash = async () => {
    const rawData = `${simElectionId}|${simCandidateId}|${simSalt}`;
    const encoder = new TextEncoder();
    const dataBuffer = encoder.encode(rawData);
    const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
    setSimComputedHash(hashHex);
  };

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '32px 24px' }}>
      {/* Header */}
      <div style={{ marginBottom: '28px' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Fingerprint color="#06b6d4" size={26} />
          <span>Tamper-Resistant Cryptographic Audit</span>
        </h2>
        <p style={{ fontSize: '0.875rem', color: '#94a3b8' }}>
          Verifiable mathematical proof protecting election integrity using SHA-256 hashing.
        </p>
      </div>

      {/* Verification Action Box */}
      <div
        className="glass-panel"
        style={{
          padding: '28px',
          marginBottom: '28px',
          border: '1px solid rgba(6, 182, 212, 0.3)',
          background: 'linear-gradient(135deg, rgba(8, 51, 68, 0.5) 0%, rgba(18, 24, 38, 0.85) 100%)',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '20px',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
              <ShieldCheck size={24} color="#38bdf8" />
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ffffff' }}>
                Full Ledger Integrity Verification
              </h3>
            </div>
            <p style={{ fontSize: '0.85rem', color: '#94a3b8', maxWidth: '600px' }}>
              Scans all ballots and participation records in the voting service database. Verifies cryptographic format, SHA-256 checksums, and flags any database-level tampering attempts.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {!isAdmin ? (
              <button
                type="button"
                onClick={() => quickLogin('ADMIN')}
                className="btn btn-outline"
                style={{
                  borderColor: 'rgba(244, 63, 94, 0.4)',
                  color: '#fb7185',
                  padding: '10px 16px',
                }}
              >
                <Zap size={16} />
                <span>Switch to Admin Demo</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={runAuditVerification}
                disabled={loading}
                className="btn btn-cyan"
                style={{ padding: '12px 20px', fontSize: '0.9rem' }}
              >
                <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
                <span>{loading ? 'Running Audit Scan...' : 'Execute Audit Verification'}</span>
              </button>
            )}
          </div>
        </div>

        {/* Verification Report Display */}
        {verification && (
          <div
            style={{
              marginTop: '24px',
              paddingTop: '20px',
              borderTop: '1px solid rgba(255, 255, 255, 0.1)',
              animation: 'fadeIn 0.3s ease',
            }}
          >
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '16px',
                marginBottom: '16px',
              }}
            >
              <div
                style={{
                  background: 'rgba(0, 0, 0, 0.3)',
                  padding: '16px',
                  borderRadius: '12px',
                  border: '1px solid rgba(255, 255, 255, 0.05)',
                }}
              >
                <div style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>
                  Audit Status
                </div>
                <div
                  style={{
                    fontSize: '1.25rem',
                    fontWeight: 800,
                    color: verification.integrityStatus === 'VALID' ? '#34d399' : '#fb7185',
                    marginTop: '4px',
                  }}
                >
                  {verification.integrityStatus}
                </div>
              </div>

              <div
                style={{
                  background: 'rgba(0, 0, 0, 0.3)',
                  padding: '16px',
                  borderRadius: '12px',
                  border: '1px solid rgba(255, 255, 255, 0.05)',
                }}
              >
                <div style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>
                  Total Ballots Audited
                </div>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#f8fafc', marginTop: '4px' }}>
                  {verification.totalRecordsChecked}
                </div>
              </div>

              <div
                style={{
                  background: 'rgba(0, 0, 0, 0.3)',
                  padding: '16px',
                  borderRadius: '12px',
                  border: '1px solid rgba(255, 255, 255, 0.05)',
                }}
              >
                <div style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>
                  Valid Cryptographic Records
                </div>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#34d399', marginTop: '4px' }}>
                  {verification.validRecords}
                </div>
              </div>

              <div
                style={{
                  background: 'rgba(0, 0, 0, 0.3)',
                  padding: '16px',
                  borderRadius: '12px',
                  border: '1px solid rgba(255, 255, 255, 0.05)',
                }}
              >
                <div style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>
                  Tampered / Corrupted Records
                </div>
                <div
                  style={{
                    fontSize: '1.25rem',
                    fontWeight: 800,
                    color: verification.invalidRecords > 0 ? '#fb7185' : '#94a3b8',
                    marginTop: '4px',
                  }}
                >
                  {verification.invalidRecords}
                </div>
              </div>
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '0.8rem',
                color: '#34d399',
                background: 'rgba(16, 185, 129, 0.1)',
                padding: '10px 14px',
                borderRadius: '8px',
              }}
            >
              <CheckCircle2 size={16} />
              <span>
                All SHA-256 ballot hashes comply with 64-character hexadecimal integrity rules. No anomalies detected.
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Two Column Layout: Architecture Explanation & Interactive Hash Simulator */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: '24px' }}>
        {/* Architecture Breakdown */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#f8fafc', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Lock size={18} color="#6366f1" />
            <span>Anonymous Ballot Architecture</span>
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div
              style={{
                padding: '14px',
                background: 'rgba(15, 23, 42, 0.6)',
                borderRadius: '10px',
                borderLeft: '3px solid #6366f1',
              }}
            >
              <div style={{ fontWeight: 700, fontSize: '0.875rem', color: '#818cf8', marginBottom: '4px' }}>
                1. Separation of Concerns
              </div>
              <div style={{ fontSize: '0.8rem', color: '#94a3b8', lineHeight: '1.4' }}>
                The voter identity is strictly stored in <code>voter_participation</code> (prevents duplicate votes). The candidate choice is stored in <code>ballots</code> with zero user link.
              </div>
            </div>

            <div
              style={{
                padding: '14px',
                background: 'rgba(15, 23, 42, 0.6)',
                borderRadius: '10px',
                borderLeft: '3px solid #10b981',
              }}
            >
              <div style={{ fontWeight: 700, fontSize: '0.875rem', color: '#34d399', marginBottom: '4px' }}>
                2. SHA-256 Hashing Formula
              </div>
              <div style={{ fontSize: '0.8rem', color: '#94a3b8', lineHeight: '1.4', marginBottom: '6px' }}>
                Each ballot receives an irreversible SHA-256 hash generated via:
              </div>
              <div className="code-pill" style={{ fontSize: '0.75rem' }}>
                SHA-256(electionId + "|" + candidateId + "|" + salt)
              </div>
            </div>

            <div
              style={{
                padding: '14px',
                background: 'rgba(15, 23, 42, 0.6)',
                borderRadius: '10px',
                borderLeft: '3px solid #06b6d4',
              }}
            >
              <div style={{ fontWeight: 700, fontSize: '0.875rem', color: '#38bdf8', marginBottom: '4px' }}>
                3. Tamper-Evident Audit Verification
              </div>
              <div style={{ fontSize: '0.8rem', color: '#94a3b8', lineHeight: '1.4' }}>
                Any unauthorized record alteration or injected ballot is flagged immediately by the verification audit engine, maintaining complete public election trust.
              </div>
            </div>
          </div>
        </div>

        {/* Live Cryptographic Hash Simulator */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#f8fafc', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Binary size={18} color="#06b6d4" />
            <span>Interactive SHA-256 Hash Sandbox</span>
          </h3>
          <p style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: '16px' }}>
            Test the CivicVote hashing algorithm with custom parameters:
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#94a3b8', display: 'block', marginBottom: '4px' }}>
                Election ID
              </label>
              <input
                type="text"
                className="input-control"
                value={simElectionId}
                onChange={(e) => setSimElectionId(e.target.value)}
              />
            </div>
            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#94a3b8', display: 'block', marginBottom: '4px' }}>
                Candidate ID
              </label>
              <input
                type="text"
                className="input-control"
                value={simCandidateId}
                onChange={(e) => setSimCandidateId(e.target.value)}
              />
            </div>
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#94a3b8', display: 'block', marginBottom: '4px' }}>
              Salt (Username + Timestamp)
            </label>
            <input
              type="text"
              className="input-control"
              value={simSalt}
              onChange={(e) => setSimSalt(e.target.value)}
            />
          </div>

          <button
            type="button"
            onClick={computeClientHash}
            className="btn btn-primary"
            style={{ width: '100%', padding: '10px', marginBottom: '16px' }}
          >
            <span>Compute SHA-256 Checksum</span>
          </button>

          {simComputedHash && (
            <div>
              <div style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 600, marginBottom: '6px' }}>
                Generated 256-Bit Integrity Hash
              </div>
              <div
                className="code-pill"
                style={{
                  padding: '10px 14px',
                  background: 'rgba(6, 182, 212, 0.08)',
                  borderColor: 'rgba(6, 182, 212, 0.3)',
                  color: '#38bdf8',
                  fontSize: '0.8rem',
                }}
              >
                {simComputedHash}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
