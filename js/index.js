import { TOTAL_CARDS } from "./modules/constants.js";
import { fetchCards, shuffle } from "./modules/utils.js";
import { generateCard, clearBoard } from "./modules/ui.js";
import { flipCard, startTimer, resetGame } from "./modules/engine.js";

async function initGame() {
  clearBoard();
  resetGame();

  // Fetch images from API
  const imageUrls = await fetchCards(TOTAL_CARDS);
  if (imageUrls.length === 0) {
    alert(
      "Failed to load images. Please check your internet connection or try disabling ad-blockers."
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
}

document.getElementById("restart-btn").addEventListener("click", initGame);

initGame();
