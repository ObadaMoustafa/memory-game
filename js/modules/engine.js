import { INITIAL_TIME, TOTAL_CARDS } from './constants.js';
import {
  disableMatchedCards,
  showResultModal,
  unFlipCards,
  updateInfo,
  renderLeaderboard,
  clearBoard,
  showError,
  generateCard,
} from './ui.js';
import {
  formatTime,
  fetchPerform,
  isLoggedIn,
  fetchCards,
  shuffle,
  getRequest,
} from './utils.js';

export async function initGame() {
  // I check here again because maybe the token expired while on the page.
  if (!isLoggedIn()) {
    window.location.replace('login.html');
    return;
  }

  // Fetch images from API
  const imageUrls = await fetchCards();
  if (imageUrls.length === 0) {
    showError(
      'Failed to load images. Please check your internet connection or try disabling ad-blockers.',
    );
    return;
  }

  // Create pairs and shuffle
  const gameCards = shuffle([...imageUrls, ...imageUrls]);

  startTimer();

  // Render cards one by one with delay
  for (const photo of gameCards) {
    await new Promise((resolve) => setTimeout(resolve, 50));
    generateCard(photo.id, photo.src, flipCard);
  }

  // At last to avoid showing memory game slowly.
  const data = await getRequest('memory/top-scores');
  renderLeaderboard(data);
}

// Game info variables
let firstCard = null,
  secondCard = null,
  lockBoard = false,
  moves = 0,
  matches = 0,
  elapsedSeconds = 0,
  remainingSeconds = INITIAL_TIME,
  timerInterval = null;

// Game logic
export function startTimer() {
  timerInterval = setInterval(() => {
    elapsedSeconds++;
    remainingSeconds--;

    updateInfo(moves, elapsedSeconds, remainingSeconds);

    if (remainingSeconds <= 0) {
      stopGame(false);
    }
  }, 1000);
}

export function flipCard() {
  // card can't be flipped when board is locked or same card is already clicked or matched.
  if (
    lockBoard ||
    this === firstCard ||
    this.classList.contains('matched') ||
    this.classList.contains('flipped')
  )
    return;

  this.classList.add('flipped');

  if (!firstCard) {
    firstCard = this;
    return;
  }

  secondCard = this;
  moves++;
  updateInfo(moves, elapsedSeconds, remainingSeconds);
  checkForMatch();
}

function resetState() {
  firstCard = null;
  secondCard = null;
  lockBoard = false;
}

function checkForMatch() {
  const isMatch = firstCard.dataset.name === secondCard.dataset.name;

  if (isMatch) {
    matches++;
    disableMatchedCards(firstCard, secondCard);
    resetState();

    if (matches === TOTAL_CARDS) {
      stopGame(true);
    }
  } else {
    lockBoard = true;
    unFlipCards(firstCard, secondCard, () => {
      resetState();
      lockBoard = false;
    });
  }
}

function calculateScore() {
  const timeWeight = 2;
  const moveWeight = 5;
  return elapsedSeconds * timeWeight + moves * moveWeight;
}

async function stopGame(win) {
  clearInterval(timerInterval);
  lockBoard = true;

  if (win) {
    const finalScore = calculateScore();
    const timeTaken = formatTime(elapsedSeconds);

    // Send score to Symfony Backend
    await fetchPerform('game/save', 'POST', {
      id: localStorage.getItem('userId'),
      score: finalScore,
    });

    showResultModal(true, finalScore, timeTaken);
  } else {
    showResultModal(false);
  }
}

export function resetGame() {
  clearBoard();
  moves = 0;
  matches = 0;
  elapsedSeconds = 0;
  remainingSeconds = INITIAL_TIME;
  lockBoard = false;
  clearInterval(timerInterval);
  initGame();
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  });
}
