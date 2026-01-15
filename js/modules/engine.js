import { initGame } from '../index.js';
import { INITIAL_TIME, TOTAL_CARDS } from './constants.js';
import {
  disableMatchedCards,
  showResultModal,
  unFlipCards,
  updateInfo,
  renderLeaderboard,
  clearBoard,
} from './ui.js';
import { formatTime, fetchPerform } from './utils.js';

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
}
