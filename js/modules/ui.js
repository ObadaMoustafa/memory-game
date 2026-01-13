import { formatTime } from "./utils.js";

const movesDisplay = document.getElementById("moves-count");
const elapsedDisplay = document.getElementById("elapsed-time");
const remainingDisplay = document.getElementById("remaining-time");
const scoreDisplay = document.getElementById("score");
const board = document.getElementById("game-board");

export function updateUI(moves, elapsed, remaining, score = 0) {
  movesDisplay.textContent = moves;
  elapsedDisplay.textContent = formatTime(elapsed);
  remainingDisplay.textContent = formatTime(remaining);
  scoreDisplay.textContent = score;
}

export function generateCard(imgUrl, flipHandler) {
  const card = document.createElement("div");
  card.classList.add("card", "card-animation");
  card.dataset.name = imgUrl;
  card.innerHTML = `<img src="${imgUrl}" alt="card">`;
  card.addEventListener("click", flipHandler);
  board.appendChild(card);
}

export function disableCards(c1, c2) {
  c1.classList.add("matched");
  c2.classList.add("matched");
}

export function unflipCards(c1, c2, callback) {
  setTimeout(() => {
    c1.classList.remove("flipped");
    c2.classList.remove("flipped");
    callback();
  }, 1000);
}

export function clearBoard() {
  board.innerHTML = "";
}
