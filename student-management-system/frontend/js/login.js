// login.js
// Handles the login form submission on index.html

// If the user is already logged in, redirect straight to dashboard
if (localStorage.getItem('token')) {
  window.location.href = 'dashboard.html';
}

const loginForm = document.getElementById('loginForm');

loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;

  try {
    const data = await apiRequest('/auth/login', 'POST', { email, password });

    // Save token and user info for use across the app
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));

    // Redirect to dashboard
    window.location.href = 'dashboard.html';
  } catch (error) {
    showAlert(error.message, 'error');
  }
});
