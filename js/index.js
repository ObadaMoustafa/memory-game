// js/index.js
import { CARDS_ARRAY } from "./modules/constants.js";
import { shuffle } from "./modules/utils.js";
import { generateCard, clearBoard } from "./modules/ui.js";
import { flipCard, startTimer, resetGame } from "./modules/engine.js";

async function initGame() {
  clearBoard();
  resetGame();
  const shuffled = shuffle([...CARDS_ARRAY]);
  for (const item of shuffled) {
    await new Promise((resolve) => setTimeout(resolve, 50));
    generateCard(item, flipCard);
  }
  startTimer(false, 0); // false = elapsed time
}

document.getElementById("restart-btn").addEventListener("click", initGame);

initGame();
