import { BASE_SCORE, EMOJIS, INITIAL_TIME } from "./constants.js";
import { disableCards, unflipCards, updateUI } from "./ui.js";

let firstCard = null,
  secondCard = null,
  lockBoard = false,
  moves = 0,
  matches = 0,
  elapsedSeconds = 0,
  remainingSeconds = INITIAL_TIME,
  timerInterval = null;

export function startTimer() {
  timerInterval = setInterval(() => {
    elapsedSeconds++;
    remainingSeconds--;

    updateUI(moves, elapsedSeconds, remainingSeconds);

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
    this.classList.contains("matched") ||
    this.classList.contains("flipped")
  )
    return;

  this.classList.add("flipped");

  if (!firstCard) {
    firstCard = this;
    return;
  }

  secondCard = this;
  moves++;
  updateUI(moves, elapsedSeconds, remainingSeconds);
  checkForMatch();
}

function checkForMatch() {
  const isMatch = firstCard.dataset.name === secondCard.dataset.name;

  if (isMatch) {
    matches++;
    disableCards(firstCard, secondCard);
    resetState();

    if (matches === EMOJIS.length) {
      stopGame(true);
    }
  } else {
    lockBoard = true;
    unflipCards(firstCard, secondCard, () => {
      resetState();
      lockBoard = false;
    });
  }
}

function calculateScore() {
  const timePenalty = elapsedSeconds * 2;
  const movePenalty = moves * 5;
  return Math.max(0, BASE_SCORE - timePenalty - movePenalty);
}

function stopGame(win) {
  clearInterval(timerInterval);
  lockBoard = true;

  if (win) {
    const finalScore = calculateScore();
    updateUI(moves, elapsedSeconds, remainingSeconds, finalScore);

    // TODO: Replace alert with a better UI element in future
    alert(`You Win! Score: ${finalScore}`);
  } else {
    // TODO: Replace alert with a better UI element in future
    alert("Time is up! Game Over.");
  }
}

function resetState() {
  [firstCard, secondCard] = [null, null];
}

export function resetGame() {
  moves = 0;
  matches = 0;
  elapsedSeconds = 0;
  remainingSeconds = INITIAL_TIME;
  lockBoard = false;
  clearInterval(timerInterval);
  updateUI(0, 0, INITIAL_TIME);
}
