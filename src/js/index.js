// // 1. Default
// import str from './model/Search';
// console.log(str);

// // 2. Named
// import { add as a, multiply as m, ID } from './view/serchVIew';
// console.log(
//   `Exported from SearchView js file! Sum: ${a(1, ID)}, Multiplication: ${m(
//     2,
//     3
//   )}`
// );

// //3. Import all
// import * as search from './view/serchVIew';
// console.log(
//   `Everything Exported from SearchView js file! Sum: ${search.add(
//     10,
//     ID
//   )}, Multiplication: ${m(2, 4)}, ID: ${search.ID}`
// );

/////////////////////////////////////////////////////////////////////////
//  GLOBAL APP CONTROLLER

import Search from './model/Search';
import Recipe from './model/Recipe';
import List from './model/List';
import Likes from './model/Likes';
import { elements, renderLoader, clearLoader } from './view/base';
import * as searchView from './view/searchView';
import * as recipeView from './view/recipeView';
import * as listView from './view/listView';
import * as likesView from './view/likesView';

const state = {};

/*
******************************************
SEARCH CONTROLLER
******************************************
*/
const controlSearch = async () => {
  // 1. Get query from view
  const query = searchView.getInput();
  if (query.toLowerCase() === 'ham') {
    alert(new Error());
  } else if (query) {
    // 2. New search object and add to state
    state.search = new Search(query);
    // 3. Prepare UI for results
    searchView.clearResults();
    searchView.clearInput();
    renderLoader(elements.searRes);
    // 4. Search for recipes
    try {
      await state.search.getResults();
      clearLoader();

      // 5. Render results on UI
      searchView.renderResults(state.search.result);
    } catch (err) {
      console.log(error);
      alert('Error occured :(');
      clearLoader();
    }
  }
};

elements.searchForm.addEventListener('submit', (e) => {
  e.preventDefault();
  controlSearch();
});

elements.resPage.addEventListener('click', (e) => {
  const btn = e.target.closest('.btn-inline');

  if (btn) {
    const goToPage = parseInt(btn.dataset.goto, 10);
    searchView.clearResults();
    searchView.renderResults(state.search.result, goToPage);
  }
});

/*
******************************************
RECIPE CONTROLLER
******************************************
*/
const controlRecipe = async () => {
  // 1. Get Id from the URL
  const id = window.location.hash.replace('#', '');

  if (id) {
    // 2. Prepare UI for results
    recipeView.clearRecipe();
    renderLoader(elements.recipe);

    // Highlight the selected item
    if (state.search) searchView.highlightSelected(id);

    // 3. Create a new object and add it to a global state
    state.recipe = new Recipe(id);
    try {
      // 4. Get recipe data and Parse Ingredients
      await state.recipe.getRecipe();
      state.recipe.parseIngredients();
      // 5. Calculate Servings
      state.recipe.calcTime();
      state.recipe.calcServings();
      // 6. Render recipe
      clearLoader(elements.recipe);
      recipeView.renderRecipe(state.recipe, state.likes.isLiked(id));
    } catch (err) {
      console.log(err);
      alert('Something went wrong while searching :(');
    }
  }
};
// window.addEventListener('hashchange', controlRecipe);
['hashchange', 'load'].forEach((event) =>
  window.addEventListener(event, controlRecipe)
);

/*
******************************************
LIST CONTROLLER
******************************************
*/
const controlList = () => {
  if (!state.list) state.list = new List();

  // Add each ingredient to the list and UI
  state.recipe.ingredients.forEach((ing) => {
    const item = state.list.addItem(ing.count, ing.unit, ing.ingredient);
    listView.renderItem(item);
  });
};

/*
******************************************
LIKES CONTROLLER
******************************************
*/
const controlLikes = () => {
  const currentId = state.recipe.id;

  if (!state.likes) state.likes = new Likes();

  if (!state.likes.isLiked(currentId)) {
    // 1. Add item to the list of items
    const like = state.likes.addLike(
      currentId,
      state.recipe.title,
      state.recipe.publisher,
      state.recipe.image
    );
    // 2. Toggle the icon
    likesView.likeBtn(state.likes.isLiked(currentId));
    // 3. Add item to the UI
    likesView.renderListMenu(like);
  } else {
    // 1. Remove Item from the likes list
    state.likes.deleteLike(currentId);
    // 2. Toggle the icon
    likesView.likeBtn(state.likes.isLiked(currentId));

    // 3. Remove the item from the UI
    likesView.deleteListItem(currentId);
  }
  likesView.toggleIcon(state.likes.numLikes());
};

// When window is loaded
window.addEventListener('load', (e) => {
  // Creating new object when the window is loaded
  state.likes = new Likes();

  // Reading data from the local storage and assigning to the this.likes
  state.likes.readStorage();

  // Displaying on the UI
  state.likes.likes.forEach((like) => {
    likesView.renderListMenu(like);
  });

  // Toggling Like icon accordingly
  likesView.toggleIcon(state.likes.numLikes());
});

// handle the delete functionality
document.querySelector('.shopping').addEventListener('click', (e) => {
  const id = e.target.closest('.shopping__item').dataset.itemid;
  if (e.target.matches('.shopping__delete, .shopping__delete *')) {
    state.list.deleteItem(id);
    listView.deleteItem(id);
  } else if (e.target.matches('input[type = "number"]')) {
    // handle the input functionality
    state.list.updateCount(id, parseFloat(e.target.value, 10));
  }
});

// Button handling
document.querySelector('.recipe').addEventListener('click', (e) => {
  if (e.target.matches('.btn-decrease, .btn-decrease *')) {
    if (state.recipe.servings > 1) {
      state.recipe.updateServings('dec');
      recipeView.updateRecipeIngredients(state.recipe);
    }
  } else if (e.target.matches('.btn-increase, .btn-increase *')) {
    state.recipe.updateServings('inc');
    recipeView.updateRecipeIngredients(state.recipe);
  } else if (e.target.matches('.btn-recipe, .btn-recipe *')) {
    controlList();
  } else if (e.target.matches('.recipe__love, .recipe__love *')) {
    // When clicked the heart button
    controlLikes();
  }
});
