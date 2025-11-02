import { getImagesByQuery } from './js/pixabay-api.js';
import {
  createGallery,
  clearGallery,
  showLoader,
  hideLoader,
  showLoadMoreButton,
  hideLoadMoreButton,
} from './js/render-functions.js';

import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const form = document.querySelector('.form');
const input = form.elements['search-text'];
const loadMoreBtn = document.querySelector('.load-more');

let query = '';
let page = 1;
let totalHits = 0;

// Сабміт форми
form.addEventListener('submit', async event => {
  event.preventDefault();
  query = input.value.trim();

  if (!query) {
    iziToast.warning({
      title: 'Oops!',
      message: 'Please enter a search term.',
      position: 'topRight',
    });
    return;
  }

  page = 1;
  clearGallery();
  hideLoadMoreButton();
  showLoader();

  try {
    const data = await getImagesByQuery(query, page);
    hideLoader();

    totalHits = data.totalHits;

    if (!data.hits || data.hits.length === 0) {
      iziToast.error({
        title: 'No results!',
        message: 'Sorry, there are no images matching your search query.',
        position: 'topRight',
      });
      return;
    }

    createGallery(data.hits);

    if (totalHits > page * 15) showLoadMoreButton();

    iziToast.success({
      title: 'Success!',
      message: `${totalHits} images found!`,
      position: 'topRight',
    });
  } catch (error) {
    hideLoader();
    iziToast.error({
      title: 'Error!',
      message: 'Something went wrong. Please try again later.',
      position: 'topRight',
    });
  }
});

loadMoreBtn.addEventListener('click', async () => {
  page += 1;
  showLoader();
  hideLoadMoreButton();

  try {
    const data = await getImagesByQuery(query, page);
    hideLoader();

    createGallery(data.hits);
    const { height: cardHeight } = document
      .querySelector('.gallery')
      .firstElementChild.getBoundingClientRect();
    window.scrollBy({ top: cardHeight * 2, behavior: 'smooth' });

    if (page * 15 >= totalHits) {
      hideLoadMoreButton();
      iziToast.info({
        title: 'End',
        message: "We're sorry, but you've reached the end of search results.",
        position: 'topRight',
      });
    } else {
      showLoadMoreButton();
    }
  } catch (error) {
    hideLoader();
    iziToast.error({
      title: 'Error!',
      message: 'Failed to load more images.',
      position: 'topRight',
    });
  }
});
