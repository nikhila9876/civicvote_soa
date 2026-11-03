import React, { useEffect } from 'react';
import { CheckCircle2, AlertTriangle, XCircle, Info, X } from 'lucide-react';

export const Toast = ({ toast, onClose }) => {
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      onClose();
    }, 4500);
    return () => clearTimeout(timer);
  }, [toast, onClose]);

  if (!toast) return null;

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-400" color="#34d399" />,
    error: <XCircle className="w-5 h-5 text-rose-400" color="#fb7185" />,
    warning: <AlertTriangle className="w-5 h-5 text-amber-400" color="#fbbf24" />,
    info: <Info className="w-5 h-5 text-cyan-400" color="#38bdf8" />,
  };

  const borders = {
    success: 'rgba(16, 185, 129, 0.4)',
    error: 'rgba(244, 63, 94, 0.4)',
    warning: 'rgba(245, 158, 11, 0.4)',
    info: 'rgba(6, 182, 212, 0.4)',
  };

  const glows = {
    success: 'rgba(16, 185, 129, 0.15)',
    error: 'rgba(244, 63, 94, 0.15)',
    warning: 'rgba(245, 158, 11, 0.15)',
    info: 'rgba(6, 182, 212, 0.15)',
  };

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: 9999,
        background: '#111827',
        border: `1px solid ${borders[toast.type] || borders.info}`,
        boxShadow: `0 10px 25px ${glows[toast.type] || glows.info}`,
        borderRadius: '12px',
        padding: '14px 18px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        maxWidth: '420px',
        animation: 'scaleIn 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
      }}
    >
      <div>{icons[toast.type] || icons.info}</div>
      <div style={{ flex: 1 }}>
        {toast.title && (
          <div style={{ fontWeight: 600, fontSize: '0.9rem', color: '#f8fafc', marginBottom: '2px' }}>
            {toast.title}
          </div>
        )}
        <div style={{ fontSize: '0.825rem', color: '#94a3b8' }}>{toast.message}</div>
      </div>
      <button
        onClick={onClose}
        style={{
          background: 'none',
          border: 'none',
          color: '#64748b',
          cursor: 'pointer',
          padding: '4px',
        }}
      >
        <X size={16} />
      </button>
    </div>
  );
};
