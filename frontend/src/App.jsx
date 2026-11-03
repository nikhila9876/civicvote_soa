import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { ElectionsView } from './components/ElectionsView';
import { ResultsView } from './components/ResultsView';
import { AuditView } from './components/AuditView';
import { AdminView } from './components/AdminView';
import { ArchitectureView } from './components/ArchitectureView';
import { AuthModal } from './components/AuthModal';
import { VoteModal } from './components/VoteModal';
import { Toast } from './components/Toast';
import { api } from './api/apiClient';
import { ShieldCheck, Heart, Sparkles } from 'lucide-react';

function MainApp() {
  const { user, isAdmin, quickLogin } = useAuth();
  const [activeTab, setActiveTab] = useState('elections');
  const [backendHealthy, setBackendHealthy] = useState(true);

  // Modals & Selection state
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState('login');
  const [votingElection, setVotingElection] = useState(null);
  const [resultsElectionId, setResultsElectionId] = useState(null);
  const [toast, setToast] = useState(null);

  // Monitor backend health
  useEffect(() => {
    const probe = async () => {
      const ok = await api.checkHealth();
      setBackendHealthy(ok);
    };
    probe();
    const interval = setInterval(probe, 15000);
    return () => clearInterval(interval);
  }, []);

  const handleOpenAuth = (mode = 'login') => {
    setAuthModalMode(mode);
    setAuthModalOpen(true);
  };

  const handleSelectVote = (election) => {
    setVotingElection(election);
  };

  const handleSelectResults = (electionId) => {
    setResultsElectionId(electionId);
    setActiveTab('results');
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Toast Notification Container */}
      <Toast toast={toast} onClose={() => setToast(null)} />

      {/* Navigation Bar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenAuth={handleOpenAuth}
        backendHealthy={backendHealthy}
      />

      {/* Main Tab Content */}
      <main style={{ flex: 1 }}>
        {activeTab === 'elections' && (
          <ElectionsView
            onSelectVote={handleSelectVote}
            onSelectResults={handleSelectResults}
            onOpenAuth={handleOpenAuth}
            onToast={setToast}
          />
        )}

        {activeTab === 'results' && (
          <ResultsView
            selectedElectionId={resultsElectionId}
            onToast={setToast}
          />
        )}

        {activeTab === 'audit' && (
          <AuditView
            onToast={setToast}
            onOpenAuth={handleOpenAuth}
          />
        )}

        {activeTab === 'admin' && (
          <AdminView
            onToast={setToast}
          />
        )}

        {activeTab === 'architecture' && (
          <ArchitectureView />
        )}
      </main>

      {/* Modals */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialMode={authModalMode}
        onToast={setToast}
      />

      <VoteModal
        election={votingElection}
        isOpen={!!votingElection}
        onClose={() => setVotingElection(null)}
        onVoteSuccess={(electionId) => {
          // Can refresh or trigger results
        }}
        onToast={setToast}
        onOpenAudit={() => setActiveTab('audit')}
      />

      {/* Footer */}
      <footer
        style={{
          borderTop: '1px solid var(--border-subtle)',
          background: 'rgba(10, 13, 20, 0.9)',
          padding: '24px',
          marginTop: 'auto',
        }}
      >
        <div
          style={{
            maxWidth: '1280px',
            margin: '0 auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '16px',
            fontSize: '0.85rem',
            color: '#64748b',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ShieldCheck size={18} color="#6366f1" />
            <span style={{ fontWeight: 700, color: '#94a3b8' }}>CivicVote Platform</span>
            <span>— Tamper-Resistant Digital Election System</span>
          </div>

          <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
            <span className="badge badge-indigo">Java 21</span>
            <span className="badge badge-emerald">Spring Boot 3</span>
            <span className="badge badge-cyan">Eureka :8761</span>
            <span className="badge badge-purple">Gateway :8080</span>
            <span className="badge badge-amber">MySQL 8.0</span>
            <span className="badge badge-rose">SHA-256</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}
