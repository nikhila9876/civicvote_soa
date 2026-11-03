// Multi-color palette generator for candidates, roles, and status
export const CANDIDATE_PALETTES = [
  {
    bg: 'rgba(16, 185, 129, 0.12)',
    border: 'rgba(16, 185, 129, 0.35)',
    accent: '#10b981',
    gradient: 'linear-gradient(135deg, #10b981, #059669)',
    light: '#d1fae5',
    text: '#34d399',
    badge: 'Emerald',
  },
  {
    bg: 'rgba(99, 102, 241, 0.12)',
    border: 'rgba(99, 102, 241, 0.35)',
    accent: '#6366f1',
    gradient: 'linear-gradient(135deg, #6366f1, #4f46e5)',
    light: '#e0e7ff',
    text: '#818cf8',
    badge: 'Indigo',
  },
  {
    bg: 'rgba(245, 158, 11, 0.12)',
    border: 'rgba(245, 158, 11, 0.35)',
    accent: '#f59e0b',
    gradient: 'linear-gradient(135deg, #f59e0b, #d97706)',
    light: '#fef3c7',
    text: '#fbbf24',
    badge: 'Amber',
  },
  {
    bg: 'rgba(236, 72, 153, 0.12)',
    border: 'rgba(236, 72, 153, 0.35)',
    accent: '#ec4899',
    gradient: 'linear-gradient(135deg, #ec4899, #db2777)',
    light: '#fce7f3',
    text: '#f472b6',
    badge: 'Rose',
  },
  {
    bg: 'rgba(6, 182, 212, 0.12)',
    border: 'rgba(6, 182, 212, 0.35)',
    accent: '#06b6d4',
    gradient: 'linear-gradient(135deg, #06b6d4, #0891b2)',
    light: '#cffafe',
    text: '#38bdf8',
    badge: 'Cyan',
  },
  {
    bg: 'rgba(168, 85, 247, 0.12)',
    border: 'rgba(168, 85, 247, 0.35)',
    accent: '#a855f7',
    gradient: 'linear-gradient(135deg, #a855f7, #9333ea)',
    light: '#f3e8ff',
    text: '#c084fc',
    badge: 'Purple',
  },
  {
    bg: 'rgba(249, 115, 22, 0.12)',
    border: 'rgba(249, 115, 22, 0.35)',
    accent: '#f97316',
    gradient: 'linear-gradient(135deg, #f97316, #ea580c)',
    light: '#ffedd5',
    text: '#fb923c',
    badge: 'Orange',
  },
];

export function getCandidateColor(indexOrId) {
  const index = Math.abs(Number(indexOrId) || 0) % CANDIDATE_PALETTES.length;
  return CANDIDATE_PALETTES[index];
}

export const STATUS_COLORS = {
  ACTIVE: {
    bg: 'rgba(16, 185, 129, 0.15)',
    border: 'rgba(16, 185, 129, 0.4)',
    text: '#34d399',
    dot: '#10b981',
    label: 'Active & Voting',
  },
  DRAFT: {
    bg: 'rgba(245, 158, 11, 0.15)',
    border: 'rgba(245, 158, 11, 0.4)',
    text: '#fbbf24',
    dot: '#f59e0b',
    label: 'Draft / Setup',
  },
  SCHEDULED: {
    bg: 'rgba(59, 130, 246, 0.15)',
    border: 'rgba(59, 130, 246, 0.4)',
    text: '#60a5fa',
    dot: '#3b82f6',
    label: 'Scheduled',
  },
  CLOSED: {
    bg: 'rgba(107, 114, 128, 0.2)',
    border: 'rgba(107, 114, 128, 0.4)',
    text: '#9ca3af',
    dot: '#6b7280',
    label: 'Closed',
  },
};
