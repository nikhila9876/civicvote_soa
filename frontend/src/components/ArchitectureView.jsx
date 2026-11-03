import React, { useState, useEffect } from 'react';
import { api } from '../api/apiClient';
import {
  Server,
  Network,
  Database,
  Shield,
  Activity,
  ArrowRight,
  Cpu,
  Radio,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';

export const ArchitectureView = () => {
  const [gatewayStatus, setGatewayStatus] = useState('checking');

  useEffect(() => {
    api.checkHealth().then((ok) => {
      setGatewayStatus(ok ? 'online' : 'offline');
    });
  }, []);

  const services = [
    {
      name: 'API Gateway',
      port: 8080,
      tech: 'Spring Cloud Gateway',
      color: '#6366f1',
      desc: 'Single entry point, JWT validation filter, CORS handling, client rate-limiting & load balancing.',
      db: null,
      status: gatewayStatus,
    },
    {
      name: 'Eureka Discovery Server',
      port: 8761,
      tech: 'Spring Cloud Netflix Eureka',
      color: '#06b6d4',
      desc: 'Centralized registry dynamically discovering instances of all microservices.',
      db: null,
      status: 'online',
    },
    {
      name: 'Auth Service',
      port: 8081,
      tech: 'Spring Boot 3 + JJWT + BCrypt',
      color: '#ec4899',
      desc: 'User registration, stateless token issuance, and password hashing.',
      db: 'civicvote_auth',
      status: 'online',
    },
    {
      name: 'Election Service',
      port: 8082,
      tech: 'Spring Boot 3 + JPA',
      color: '#f59e0b',
      desc: 'Election CRUD, scheduling, candidate manifestos, and lifecycle control.',
      db: 'civicvote_election',
      status: 'online',
    },
    {
      name: 'Voting Service',
      port: 8083,
      tech: 'Spring Boot 3 + OpenFeign',
      color: '#10b981',
      desc: 'Enforces exactly 1 vote per user, computes SHA-256 ballot hashes, decoupled anonymous storage.',
      db: 'civicvote_voting',
      status: 'online',
    },
    {
      name: 'Result Service',
      port: 8084,
      tech: 'Spring Boot 3 + OpenFeign',
      color: '#a855f7',
      desc: 'Real-time vote aggregation, Feign endpoint receiver, and winner calculations.',
      db: 'civicvote_result',
      status: 'online',
    },
  ];

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '32px 24px' }}>
      {/* Header */}
      <div style={{ marginBottom: '28px' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Server color="#6366f1" size={26} />
          <span>Microservices System Architecture</span>
        </h2>
        <p style={{ fontSize: '0.875rem', color: '#94a3b8' }}>
          A resilient distributed topology built on Spring Boot 3, Spring Cloud, Eureka, and MySQL.
        </p>
      </div>

      {/* Services Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
          gap: '20px',
          marginBottom: '32px',
        }}
      >
        {services.map((srv) => (
          <div
            key={srv.name}
            className="glass-panel"
            style={{
              padding: '24px',
              borderTop: `4px solid ${srv.color}`,
              background: 'rgba(18, 24, 38, 0.85)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <span
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  fontFamily: 'var(--font-mono)',
                  color: srv.color,
                  background: `${srv.color}15`,
                  padding: '3px 8px',
                  borderRadius: '6px',
                  border: `1px solid ${srv.color}40`,
                }}
              >
                Port :{srv.port}
              </span>

              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span
                  style={{
                    width: '7px',
                    height: '7px',
                    borderRadius: '50%',
                    background: srv.status === 'online' ? '#10b981' : '#f43f5e',
                    boxShadow: `0 0 8px ${srv.status === 'online' ? '#10b981' : '#f43f5e'}`,
                  }}
                />
                <span style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'capitalize' }}>
                  {srv.status}
                </span>
              </div>
            </div>

            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#ffffff', marginBottom: '6px' }}>
              {srv.name}
            </h3>
            <div style={{ fontSize: '0.8rem', color: '#818cf8', fontWeight: 600, marginBottom: '10px' }}>
              {srv.tech}
            </div>
            <p style={{ fontSize: '0.85rem', color: '#94a3b8', lineHeight: '1.5', marginBottom: '16px' }}>
              {srv.desc}
            </p>

            {srv.db && (
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '0.75rem',
                  color: '#64748b',
                  background: 'rgba(0, 0, 0, 0.3)',
                  padding: '4px 10px',
                  borderRadius: '6px',
                }}
              >
                <Database size={13} color="#94a3b8" />
                <span>MySQL Schema: <strong>{srv.db}</strong></span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Inter-Service Workflow Explainer */}
      <div className="glass-panel" style={{ padding: '28px' }}>
        <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#ffffff', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Network size={20} color="#06b6d4" />
          <span>Inter-Service Communication Sequence</span>
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
          <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '16px', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
            <div style={{ color: '#6366f1', fontWeight: 700, fontSize: '0.9rem', marginBottom: '4px' }}>
              1. Client → API Gateway
            </div>
            <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
              Frontend makes requests with JWT Bearer tokens to port 8080. Gateway validates signature and forwards identity headers.
            </div>
          </div>

          <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '16px', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
            <div style={{ color: '#10b981', fontWeight: 700, fontSize: '0.9rem', marginBottom: '4px' }}>
              2. Voting Service → Feign
            </div>
            <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
              When a ballot is sealed, Voting Service immediately notifies Result Service via Declarative OpenFeign client without blocking the voter.
            </div>
          </div>

          <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '16px', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
            <div style={{ color: '#06b6d4', fontWeight: 700, fontSize: '0.9rem', marginBottom: '4px' }}>
              3. Eureka Service Discovery
            </div>
            <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
              All 5 microservices heartbeat to Eureka on port 8761 every 30 seconds to support seamless zero-downtime horizontal scaling.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
