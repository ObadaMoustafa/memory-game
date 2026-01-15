export const EMOJIS = Array.from({ length: 5 }, (_, i) => ({
  id: i + 1,
  src: `./js/modules/placeholder-imgs/icon-${i + 1}.png`,
}));

export const API_KEY =
  'Pj9QKRMC0DKsI5eHvWqUdYO38TW4owiWEXRdDtvxb0CgO9B5TDe6rz16';

// todo: change the total cards to number in production.
export const TOTAL_CARDS = 18;
export const PHOTOS_URL = `https://api.pexels.com/v1/search?query=random&per_page=${TOTAL_CARDS}&page=1&orientation=square&size=small`;
// todo: make the API call very random photos.
export const INITIAL_TIME = 600;
export const BASE_SCORE = TOTAL_CARDS * 100;
export const SERVER_URL = 'http://localhost:8000/';
