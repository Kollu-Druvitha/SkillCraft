// api.js
// Central place for API base URL and reusable fetch helper functions.
// Since the backend serves the frontend, a relative path works both
// locally and after deployment.

const API_BASE_URL = '/api';

/**
 * Generic request helper that attaches the JWT token (if present)
 * and handles JSON parsing + basic error handling.
 * @param {string} endpoint - e.g. '/auth/login'
 * @param {string} method - 'GET' | 'POST' | 'PUT' | 'DELETE'
 * @param {object|null} body - request payload
 */
async function apiRequest(endpoint, method = 'GET', body = null) {
  const token = localStorage.getItem('token');

  const headers = {
    'Content-Type': 'application/json'
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const options = {
    method,
    headers
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    // Throw an error with the message returned from the backend (if any)
    throw new Error(data.message || 'Something went wrong. Please try again.');
  }

  return data;
}

/**
 * Redirects to login page if no auth token is found.
 * Call this at the top of any protected page (like dashboard.html).
 */
function requireAuth() {
  const token = localStorage.getItem('token');
  if (!token) {
    window.location.href = 'index.html';
  }
}

/**
 * Shows a message inside the alert box on the current page.
 * @param {string} message
 * @param {'success'|'error'} type
 */
function showAlert(message, type = 'error') {
  const alertBox = document.getElementById('alertBox');
  if (!alertBox) return;

  alertBox.textContent = message;
  alertBox.className = `alert ${type}`;
  alertBox.classList.remove('hidden');

  // Auto-hide after 4 seconds
  setTimeout(() => {
    alertBox.classList.add('hidden');
  }, 4000);
}
