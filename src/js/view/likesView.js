import { elements } from './base';
import { limitRecipeTitle } from './searchView';

// toggle the like btn
export const likeBtn = (isLiked) => {
  const likeString = isLiked ? '' : '-outlined';
  document
    .querySelector('.recipe__love use')
    .setAttribute('href', `img/icons.svg#icon-heart${likeString}`);
};

// Like icon and list
export const toggleIcon = (likesNum) => {
  elements.likesField.style.visibility = likesNum > 0 ? 'visible' : 'hidden';
};

export const renderListMenu = (recipe) => {
  const menuListMarkup = `
  <li>
    <a class="likes__link" href="#${recipe.id}">
        <figure class="likes__fig">
            <img src="${recipe.img}" alt="${recipe.title}">
        </figure>
        <div class="likes__data">
            <h4 class="likes__name">${limitRecipeTitle(recipe.title)}</h4>
            <p class="likes__author">The Pioneer Woman</p>
        </div>
    </a>
  </li>
  `;
  elements.likesList.insertAdjacentHTML('beforeend', menuListMarkup);
};

export const deleteListItem = (id) => {
  const deletedItem = document.querySelector(`.likes__link[href = '#${id}']`)
    .parentNode;
  deletedItem.parentNode.removeChild(deletedItem);
};
