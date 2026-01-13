import { PHOTOS_URL } from "./constants";

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

export async function fetchCards(limit) {
  try {
    const response = await fetch(`${PHOTOS_URL}${limit}`);
    const data = await response.json();
    // RETURN images URLs only.
    return data.map((img) => img.download_url);
  } catch (error) {
    console.error("Error fetching images:", error);
    return [];
  }
}
