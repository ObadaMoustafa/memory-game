import { SERVER_URL } from './modules/constants.js';
import { getRequest, logout } from './modules/utils.js';

const authForm = document.getElementById('auth-form'),
  authTitle = document.getElementById('auth-title'),
  authBtn = document.getElementById('auth-btn'),
  toggleLink = document.getElementById('toggle-link'),
  emailGroup = document.getElementById('email-group'),
  errorMsg = document.getElementById('error-msg');

let isLogin = true;

toggleLink.addEventListener('click', (e) => {
  e.preventDefault();
  isLogin = !isLogin;

  authTitle.textContent = isLogin ? 'Login' : 'Register';
  authBtn.textContent = isLogin ? 'Login' : 'Register';
  toggleLink.textContent = isLogin ? 'Register here' : 'Login here';
  document.getElementById('toggle-text').textContent = isLogin
    ? "Don't have an account?"
    : 'Already have an account?';

  emailGroup.style.display = isLogin ? 'none' : 'block';
  errorMsg.textContent = '';
});

authForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  errorMsg.textContent = '';

  const username = document.getElementById('username');
  const password = document.getElementById('password');
  const email = document.getElementById('email');

  const endpoint = isLogin ? 'memory/login' : 'memory/register';
  const payload = {
    username: username.value,
    password: password.value,
    email: email?.value,
  };

  try {
    const response = await fetch(`${SERVER_URL}${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (isLogin) {
      const data = await response.json();
      if (!response.ok) {
        errorMsg.textContent = 'Authentication failed. Please try again.';
        throw new Error(data.message || 'Authentication failed');
      }

      // Save token first so getRequest can use it
      localStorage.setItem('token', data.token);

      const playerData = await getRequest('player');

      // saving player ID to localStorage for later use.
      if (playerData && playerData.id) {
        localStorage.setItem('userId', playerData.id);
        const prefs = await getRequest('player/preferences');
        localStorage.setItem('color_closed', prefs.color_closed || '#2c3e50');
        localStorage.setItem('color_found', prefs.color_found || '#27ae60');
        localStorage.setItem('preferred_api', prefs.preferred_api || '');
      } else {
        errorMsg.textContent = 'Failed to retrieve player data.';
        logout();
        return;
      }

      window.location.replace('index.html');
    } else {
      // Show success message
      const authBox = document.getElementsByClassName('auth-box')[0];
      const authBoxContentTemp = authBox.innerHTML;
      authBox.innerHTML = `
          <div style="text-align: center; padding: 20px;">
            <img src="https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExaXNhZGlncGszc3Q5a2c4ZmhoNWRuejdmOGl6MTViMXEzM2Z1MXRxbiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/tf9jjMcO77YzV4YPwE/giphy.gif" 
                 alt="Success" style="width: 100%; border-radius: 10px;">
            <p style="margin-top: 10px; font-weight: bold; color: #27ae60;">You can Login!</p>
          </div>
        `;

      // redirect to login after delay
      setTimeout(() => {
        authBox.innerHTML = authBoxContentTemp;
        location.reload();
      }, 2500);
    }
  } catch (error) {
    errorMsg.textContent = error.message;
    username.value = '';
    password.value = '';
    email.value = '';
    username.focus();
  }
});
