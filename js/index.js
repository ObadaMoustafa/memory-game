import { TOTAL_CARDS } from './modules/constants.js';
import {
  fetchCards,
  getRequest,
  isLoggedIn,
  logout,
  shuffle,
} from './modules/utils.js';
import {
  generateCard,
  renderLeaderboard,
  showProfileModal,
  showHistoryModal,
} from './modules/ui.js';
import { flipCard, startTimer, resetGame } from './modules/engine.js';

function setButtons() {
  const avatarTrigger = document.getElementById('avatar-trigger');
  const dropdownMenu = document.getElementById('dropdown-menu');

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

export async function initGame() {
  // I check here again because maybe the token expired while on the page.
  if (!isLoggedIn()) {
    window.location.replace('login.html');
    return;
  }

  // Fetch images from API
  const imageUrls = await fetchCards(TOTAL_CARDS);
  if (imageUrls.length === 0) {
    alert(
      'Failed to load images. Please check your internet connection or try disabling ad-blockers.'
    );
    return;
  }

  // Create pairs and shuffle
  const gameCards = shuffle([...imageUrls, ...imageUrls]);

  // Render cards one by one with delay
  for (const photo of gameCards) {
    await new Promise((resolve) => setTimeout(resolve, 50));
    generateCard(photo.id, photo.src, flipCard);
  }

  startTimer();

  // At last to avoid showing memory game slowly.
  const data = await getRequest('memory/top-scores');
  renderLeaderboard(data);
}

// Check for authentication token
if (!isLoggedIn()) {
  window.location.replace('login.html');
} else {
  setButtons();
  initGame();
}
