import axios from 'axios';

const API_KEY = '53064153-2d7216b374d8f49c4006b10a4';
const BASE_URL = 'https://pixabay.com/api/';

export async function getImagesByQuery(query, page = 1) {
  try {
    const response = await axios.get(BASE_URL, {
      params: {
        key: API_KEY,
        q: query,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
        per_page: 15,
        page: page,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Pixabay API error:', error);
    throw error;
  }
}
