import { API_KEY, PHOTOS_URL } from './constants.js';
import { SERVER_URL } from './constants.js';

export function shuffle(array) {
  return array.sort(() => Math.random() - 0.5);
}

export function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs
    .toString()
    .padStart(2, '0')}`;
}

export async function fetchCards() {
  try {
    const response = await fetch(PHOTOS_URL, {
      method: 'GET',
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
      'Error fetching images:',
      error,
      'Try using browser with no add-on blockers.'
    );
    return [];
  }
}

export async function saveScore(id, username, score) {
  try {
    await fetch(`${SERVER_URL}/memory/save`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, username, score }),
    });
  } catch (error) {
    console.error('Failed to save score:', error);
  }
}

const getHeaders = () => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${localStorage.getItem('token')}`,
});

export async function getRequest(endpoint) {
  try {
    const response = await fetch(`${SERVER_URL}${endpoint}`, {
      method: 'GET',
      headers: getHeaders(),
    });

    if (response.status === 401) {
      logout();
      return null;
    }

    if (!response.ok) {
      console.log(response);

      throw new Error(
        `HTTP error! status: ${response.statusText} code: ${response.status}`
      );
    }

    return await response.json();
  } catch (error) {
    console.error('Fetch error:', error);
    return [];
  }
}

export async function fetchPerform(endpoint, method, body) {
  try {
    const response = await fetch(`${SERVER_URL}${endpoint}`, {
      method,
      headers: getHeaders(),
      body: JSON.stringify(body),
    });

    if (response.status === 401) {
      logout();
      return null;
    }

    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    // for no content responses
    if (response.status === 204) return true;
    return await response.json();
  } catch (error) {
    console.error('Post error:', error);
    return null;
  }
}

export function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('userId');
  window.location.replace('login.html');
}
