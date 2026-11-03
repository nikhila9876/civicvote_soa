// CivicVote API Client – routes all requests to API Gateway (http://localhost:8080/api)

const BASE_URL = 'http://localhost:8080/api';

function getAuthHeaders() {
  const token = localStorage.getItem('civicvote_token');
  const headers = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

async function handleResponse(res) {
  if (res.status === 204) {
    return null;
  }
  let data;
  try {
    data = await res.json();
  } catch (err) {
    data = null;
  }

  if (!res.ok) {
    const errorMsg = data?.message || data?.error || `Request failed with status ${res.status}`;
    const error = new Error(errorMsg);
    error.status = res.status;
    error.data = data;
    throw error;
  }
  return data;
}

export const api = {
  // Auth
  register: (payload) =>
    fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }).then(handleResponse),

  login: (payload) =>
    fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }).then(handleResponse),

  getMe: () =>
    fetch(`${BASE_URL}/auth/me`, {
      headers: getAuthHeaders(),
    }).then(handleResponse),

  // Elections
  getElections: () =>
    fetch(`${BASE_URL}/elections`, {
      headers: getAuthHeaders(),
    }).then(handleResponse),

  getElectionById: (id) =>
    fetch(`${BASE_URL}/elections/${id}`, {
      headers: getAuthHeaders(),
    }).then(handleResponse),

  createElection: (payload) =>
    fetch(`${BASE_URL}/elections`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    }).then(handleResponse),

  updateElection: (id, payload) =>
    fetch(`${BASE_URL}/elections/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    }).then(handleResponse),

  deleteElection: (id) =>
    fetch(`${BASE_URL}/elections/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    }).then(handleResponse),

  activateElection: (id) =>
    fetch(`${BASE_URL}/elections/${id}/activate`, {
      method: 'POST',
      headers: getAuthHeaders(),
    }).then(handleResponse),

  closeElection: (id) =>
    fetch(`${BASE_URL}/elections/${id}/close`, {
      method: 'POST',
      headers: getAuthHeaders(),
    }).then(handleResponse),

  getCandidates: (electionId) =>
    fetch(`${BASE_URL}/elections/${electionId}/candidates`, {
      headers: getAuthHeaders(),
    }).then(handleResponse),

  addCandidate: (electionId, payload) =>
    fetch(`${BASE_URL}/elections/${electionId}/candidates`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    }).then(handleResponse),

  // Votes
  castVote: (payload) =>
    fetch(`${BASE_URL}/votes`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    }).then(handleResponse),

  getVoteStatus: (electionId) =>
    fetch(`${BASE_URL}/votes/status/${electionId}`, {
      headers: getAuthHeaders(),
    }).then(handleResponse),

  verifyAudit: () =>
    fetch(`${BASE_URL}/votes/audit/verify`, {
      headers: getAuthHeaders(),
    }).then(handleResponse),

  // Results
  getResults: (electionId) =>
    fetch(`${BASE_URL}/results/${electionId}`, {
      headers: getAuthHeaders(),
    }).then(handleResponse),

  getSummary: (electionId) =>
    fetch(`${BASE_URL}/results/${electionId}/summary`, {
      headers: getAuthHeaders(),
    }).then(handleResponse),

  calculateResults: (electionId) =>
    fetch(`${BASE_URL}/results/${electionId}/calculate`, {
      method: 'POST',
      headers: getAuthHeaders(),
    }).then(handleResponse),

  // Health Check
  checkHealth: async () => {
    try {
      const res = await fetch(`${BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}), // probe gateway
      });
      // A 400 Bad Request indicates Gateway and Auth Service are responsive
      return res.status === 400 || res.ok;
    } catch (e) {
      return false;
    }
  },
};
