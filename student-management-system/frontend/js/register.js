// register.js
// Handles the registration form submission on register.html

if (localStorage.getItem('token')) {
  window.location.href = 'dashboard.html';
}

const registerForm = document.getElementById('registerForm');

registerForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;

  if (password.length < 6) {
    showAlert('Password must be at least 6 characters long', 'error');
    return;
  }

  try {
    const data = await apiRequest('/auth/register', 'POST', { name, email, password });

    // Save token and user info, then go straight to the dashboard
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));

    showAlert('Registration successful! Redirecting...', 'success');
    setTimeout(() => {
      window.location.href = 'dashboard.html';
    }, 1000);
  } catch (error) {
    showAlert(error.message, 'error');
  }
});
