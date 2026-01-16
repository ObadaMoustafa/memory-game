import { resetGame } from './engine.js';
import { fetchPerform, formatTime, getRequest } from './utils.js';

const movesDisplay = document.getElementById('moves-count');
const elapsedDisplay = document.getElementById('elapsed-time');
const remainingDisplay = document.getElementById('remaining-time');
const scoreDisplay = document.getElementById('score');
const board = document.getElementById('game-board');

export function updateInfo(moves, elapsed, remaining, score = 0) {
  movesDisplay.textContent = moves;
  elapsedDisplay.textContent = formatTime(elapsed);
  remainingDisplay.textContent = formatTime(remaining);
  scoreDisplay.textContent = score;
}

export function generateCard(idx, imgUrl, flipHandler) {
  const card = document.createElement('div');
  card.classList.add('card');
  card.dataset.name = idx;

  const color_closed = localStorage.getItem('color_closed');
  card.style.backgroundColor = color_closed;

  card.innerHTML = `<img src="${imgUrl}" alt="card">`;
  card.addEventListener('click', flipHandler);
  board.appendChild(card);
}

export function disableMatchedCards(c1, c2) {
  const color_found = localStorage.getItem('color_found');
  c1.style.backgroundColor = color_found;
  c2.style.backgroundColor = color_found;

  c1.getElementsByTagName('img')[0].style.transform = 'scale(.8)';
  c2.getElementsByTagName('img')[0].style.transform = 'scale(.8)';

  c1.classList.add('matched');
  c2.classList.add('matched');
}

export function unFlipCards(c1, c2, callback) {
  setTimeout(() => {
    c1.classList.remove('flipped');
    c2.classList.remove('flipped');
    callback();
  }, 1000);
}

export function clearBoard() {
  board.innerHTML = '';
}

// ******** leaderboard ********* \\
export function renderLeaderboard(data) {
  const leaderboardBody = document.getElementById('leaderboard-body');
  leaderboardBody.innerHTML = data
    .map(
      (entry, index) => `
        <tr>
            <td>#${index + 1}</td>
            <td>${entry.username}</td>
            <td>${entry.score}</td>
        </tr>
    `
    )
    .join('');
}

// ******** modals ********* \\
// Result Modal
export function showResultModal(win, score, time) {
  const modal = document.getElementById('result-modal');
  const title = document.getElementById('modal-title');
  const message = document.getElementById('modal-message');
  const stats = document.getElementById('modal-stats');
  const playAgainBtn = document.getElementById('modal-restart-btn');
  if (win) {
    title.textContent = 'You Win!';
    title.style.color = '#27ae60';
    message.textContent = 'Great job! You cleared the board.';
    stats.style.display = 'block';
    document.getElementById('final-score').textContent = score;
    document.getElementById('final-time').textContent = time;
  } else {
    title.textContent = 'Game Over!';
    title.style.color = '#e74c3c';
    message.textContent = 'Time is up! Better luck next time.';
    stats.style.display = 'none';
  }

  modal.classList.remove('hidden');
  playAgainBtn.addEventListener('click', () => {
    hideResultModal();
    resetGame();
  });
}

export function hideResultModal() {
  document.getElementById('result-modal').classList.add('hidden');
}

// Profile Modal
export async function showProfileModal() {
  const playerData = await getRequest('player');
  const preferences = await getRequest('player/preferences');

  const modal = document.getElementById('profile-modal');
  // Fill Player Data
  document.getElementById('prof-username').value =
    playerData.name || playerData.username;
  document.getElementById('prof-email').value = playerData.email;

  // Fill Preferences
  if (preferences) {
    document.getElementById('pref-api').value = preferences.preferred_api || '';
    document.getElementById('pref-color-closed').value =
      preferences.color_closed || '#2c3e50';
    document.getElementById('pref-color-found').value =
      preferences.color_found || '#27ae60';
  }

  modal.classList.remove('hidden');

  // Close modal on outside click
  modal.onclick = function (event) {
    if (event.target === modal) {
      hideProfileModal();
    }
  };

  // Close modal on close button click
  document
    .getElementById('close-profile')
    .addEventListener('click', hideProfileModal);

  // Handle form submission
  document
    .getElementById('profile-form')
    .addEventListener('submit', submitProfileForm);
}

export function hideProfileModal() {
  document.getElementById('profile-modal').classList.add('hidden');
}

async function submitProfileForm(event) {
  event.preventDefault();

  const email = document.getElementById('prof-email').value;
  const preferences = {
    id: localStorage.getItem('userId'),
    api: document.getElementById('pref-api').value,
    color_closed: document.getElementById('pref-color-closed').value,
    color_found: document.getElementById('pref-color-found').value,
  };
  // Update Email (PUT)
  await fetchPerform('player/email', 'PUT', { email });

  // Update Preferences (POST)
  await fetchPerform('player/preferences', 'POST', preferences);
  localStorage.setItem('color_closed', preferences.color_closed);
  localStorage.setItem('color_found', preferences.color_found);

  // Update card colors immediately
  document.querySelectorAll('.card').forEach((card) => {
    card.style.backgroundColor = preferences.color_closed;
  });
  document.querySelectorAll('.card.matched').forEach((card) => {
    card.style.backgroundColor = preferences.color_found;
  });

  // Show success message
  const modal = document.getElementById('modal-content');
  const modalContent = modal.innerHTML;
  modal.innerHTML = `
    <div style="text-align: center; padding: 20px;">
      <img src="https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExaXNhZGlncGszc3Q5a2c4ZmhoNWRuejdmOGl6MTViMXEzM2Z1MXRxbiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/tf9jjMcO77YzV4YPwE/giphy.gif" 
           alt="Success" style="width: 100%; border-radius: 10px;">
      <p style="margin-top: 10px; font-weight: bold; color: #27ae60;">Updated Successfully!</p>
    </div>
  `;

  // Restore original content after delay
  setTimeout(() => {
    hideProfileModal();
    modal.innerHTML = modalContent;
  }, 2500);
}

// History Modal
export async function showHistoryModal() {
  const games = await getRequest('player/games');
  const modal = document.getElementById('history-modal');
  const tbody = document.getElementById('history-body');

  tbody.innerHTML = ''; // Clear previous data

  if (games && games.length > 0) {
    games.forEach((game) => {
      const row = document.createElement('tr');
      // Format time from "2026-01-15 11:21:07.000000" to "11:21"
      const time = game.date.date.split(' ')[1].substring(0, 5);

      row.innerHTML = `
        <td>${game.day} <small>(${time})</small></td>
        <td>${game.score}</td>
      `;
      tbody.appendChild(row);
    });
  } else {
    tbody.innerHTML = '<tr><td colspan="2">No games played yet.</td></tr>';
  }

  modal.classList.remove('hidden');

  // Close events
  document
    .getElementById('close-history')
    .addEventListener('click', hideHistoryModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) hideHistoryModal();
  });
}

export function hideHistoryModal() {
  document.getElementById('history-modal').classList.add('hidden');
}

// ******** Error handler ********* \\
export function showError(message) {
  const errorBar = document.getElementById('error-bar');
  const errorMsg = document.getElementById('error-message');

  errorMsg.textContent = message;
  errorBar.classList.remove('hidden');

  setTimeout(() => {
    hideError();
  }, 6000);
}

export function hideError() {
  const errorBar = document.getElementById('error-bar');
  if (errorBar) {
    errorBar.classList.add('hidden');
  }
}
