import { API_KEY, PHOTOS_URL } from "./constants.js";

export function shuffle(array) {
  return array.sort(() => Math.random() - 0.5);
}

export function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, "0")}:${secs
    .toString()
    .padStart(2, "0")}`;
}

export async function fetchCards() {
  try {
    const response = await fetch(PHOTOS_URL, {
      method: "GET",
      headers: {
        Authorization: API_KEY,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    // RETURN array of object => {id, src}.

    return data.photos.map((photo) => ({ id: photo.id, src: photo.src.tiny }));
  } catch (error) {
    console.error(
      "Error fetching images:",
      error,
      "Try using browser with no add-on blockers."
    );
    return [];
  }
}
