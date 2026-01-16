import { isLoggedIn, logout } from './modules/utils.js';
import {
  generateCard,
  showProfileModal,
  showHistoryModal,
  hideError,
} from './modules/ui.js';
import { resetGame, initGame } from './modules/engine.js';

function setButtons() {
  const avatarTrigger = document.getElementById('avatar-trigger');
  const dropdownMenu = document.getElementById('dropdown-menu');

  // Error Bar Close Button
  document.getElementById('close-error').addEventListener('click', hideError);
  // Game Restart Button
  document.getElementById('restart-btn').addEventListener('click', resetGame);

  // User Menu (Avatar & Dropdown)
  avatarTrigger.addEventListener('click', (e) => {
    e.stopPropagation();
    dropdownMenu.classList.toggle('hidden');
  });

  document.addEventListener('click', () => {
    dropdownMenu.classList.add('hidden');
  });

  // Menu Links
  document.getElementById('logout-btn').addEventListener('click', logout);

  document
    .getElementById('profile-link')
    .addEventListener('click', showProfileModal);

  document
    .getElementById('history-link')
    .addEventListener('click', showHistoryModal);
}

// Check for authentication token
if (!isLoggedIn()) {
  window.location.replace('login.html');
} else {
  setButtons();
  initGame();
}
