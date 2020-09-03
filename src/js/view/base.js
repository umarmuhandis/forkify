// Reusable stuff goes here
export const elements = {
  searchForm: document.querySelector('.search'),
  searchInput: document.querySelector('.search__field'),
  searchResList: document.querySelector('.results__list'),
  searRes: document.querySelector('.results'),
  resPage: document.querySelector('.results__pages'),
  recipe: document.querySelector('.recipe'),
  shoppingList: document.querySelector('.shopping__list'),
  likesField: document.querySelector('.likes__field'),
  likesList: document.querySelector('.likes__list'),
};

export const elementStrings = {
  loader: 'loader',
};

export const renderLoader = (parent) => {
  const loader = `
    <div class = '${elementStrings.loader}'>
      <svg>
        <use href = "img/icons.svg#icon-cw"></use>
      </svg>
    </div>
  `;
  parent.insertAdjacentHTML('afterbegin', loader);
};

export const clearLoader = () => {
  const loader = document.querySelector(`.${elementStrings.loader}`);
  if (loader) {
    loader.parentNode.removeChild(loader);
  }
};
