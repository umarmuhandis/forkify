// // 2. Named
// export const add = (a, b) => a + b;
// export const multiply = (a, b) => a * b;
// export const ID = 12;

////////////////////////////////////////////////////

import { elements } from './base';

export const getInput = () => elements.searchInput.value;
export const clearInput = () => {
  elements.searchInput.value = '';
};
export const clearResults = () => {
  elements.searchResList.innerHTML = '';
  elements.resPage.innerHTML = '';
};

export const highlightSelected = (id) => {
  document
    .querySelectorAll('.results__link')
    .forEach((el) => el.classList.remove('results__link--active'));

  document
    .querySelector(`.results__link[href = "#${id}"]`)
    .classList.add('results__link--active');
};

// title = "Best Pizza Dough Ever", 21
// ['Best', 'Pizza', 'Dough', 'Ever']
// acc = 0 + 4 = 4, newTitle = [Best]
// acc = 4 + 5 = 9, newTitle = [Best, PIzza]
// acc = 9 + 5 = 14, newTitle = [best, pizza, dough]
// acc = 14 + 4 = 18, newTitle = [best, pizza, dough]
export const limitRecipeTitle = (title, limit = 17) => {
  const newTitle = [];
  if (title.length > limit) {
    title.split(' ').reduce((acc, cur) => {
      if (acc + cur.length <= limit) {
        newTitle.push(cur);
      }
      return acc + cur.length;
    }, 0);
    title = `${newTitle.join(' ')}...`;
  }
  return title;
};

const renderRecipe = (recipe) => {
  const html = `
    <li>
      <a class="results__link results__link" href="#${recipe.recipe_id}">
          <figure class="results__fig">
              <img src="${recipe.image_url}" alt="Test">
          </figure>
          <div class="results__data">
              <h4 class="results__name">${limitRecipeTitle(recipe.title)}</h4>
              <p class="results__author">${recipe.publisher}</p>
          </div>
      </a>
    </li>
  `;
  elements.searchResList.insertAdjacentHTML('beforeend', html);
};

const createButton = (type, page) => {
  const button = `
  <button class="btn-inline results__btn--${type}" data-goto = "${page}">
    <span>Page ${page}</span>
    <svg class="search__icon">
      <use href="img/icons.svg#icon-triangle-${
        type === 'prev' ? 'left' : 'right'
      }"></use>
    </svg>
  </button>
  `;
  elements.resPage.insertAdjacentHTML('afterbegin', button);
};

const renderButton = (curPage, resPerPage, numRes) => {
  const maxPages = Math.ceil(numRes / resPerPage);
  if (curPage === 1 && maxPages > 1) {
    createButton('next', curPage + 1);
  } else if (curPage > 1 && curPage < maxPages) {
    createButton('prev', curPage - 1);
    createButton('next', curPage + 1);
  } else if (curPage === maxPages && maxPages > 1) {
    createButton('prev', curPage - 1);
  }
};

export const renderResults = (recipes, curPage = 1, resPerPage = 10) => {
  const start = (curPage - 1) * resPerPage;
  const end = curPage * resPerPage;

  recipes.slice(start, end).forEach((recipe) => {
    renderRecipe(recipe);
  });

  renderButton(curPage, resPerPage, recipes.length);
};
