import axios from 'axios';

export default class Recipe {
  constructor(id) {
    this.id = id;
  }

  async getRecipe() {
    try {
      const res = await axios(
        `https://forkify-api.herokuapp.com/api/get?rId=${this.id}`
      );
      this.title = res.data.recipe.title;
      this.image = res.data.recipe.image_url;
      this.ingredients = res.data.recipe.ingredients;
      this.publisher = res.data.recipe.publisher;
      this.url = res.data.recipe.source_url;
    } catch (error) {
      console.log(error);
      alert('Something went wrong :(');
    }
  }
  calcTime() {
    // Assuming that we need 15 minutes for each three ingredients
    const numIng = this.ingredients.length;
    const periods = Math.ceil(numIng / 3);
    this.time = periods * 15;
  }
  calcServings() {
    this.servings = 4;
  }

  parseIngredients() {
    const unitsLong = [
      'tablespoons',
      'tablespoon',
      'ounces',
      'ounce',
      'teaspoons',
      'teaspoon',
      'cups',
      'pounds',
    ];
    const unitsShort = [
      'tbsp',
      'tbsp',
      'oz',
      'oz',
      'tsp',
      'tsp',
      'cup',
      'pound',
    ];
    const units = [...unitsShort, 'kg', 'g'];

    // 1. Uniform units
    let newIngredients = this.ingredients.map((el) => {
      let ingredient = el.toLowerCase();
      unitsLong.forEach((cur, i) => {
        ingredient = ingredient.replace(cur, unitsShort[i]);
      });

      // 2. Remove parentheses
      ingredient = ingredient.replace(/ *\([^)]*\) */g, ' ');

      // 3. Parse ingredients into count, unit, and ingredient
      let objIng;

      const arrIng = ingredient.split(' ');
      const unitIndex = arrIng.findIndex((el2) => units.includes(el2));

      if (unitIndex > -1) {
        // There is a Unit and maybe a number
        const arrCount = arrIng.slice(0, unitIndex);

        let count;
        if (arrCount.length === 1) {
          count = eval(arrIng[0].replace('-', '+'));
        } else {
          count = eval(arrIng.slice(0, unitIndex).join('+'));
        }
        objIng = {
          count,
          unit: arrIng[unitIndex],
          ingredient: arrIng.slice(unitIndex + 1).join(' '),
        };
      } else if (parseInt(arrIng[0], 10)) {
        objIng = {
          count: parseInt(arrIng[0], 10),
          unit: '',
          ingredient: arrIng.slice(1).join(' '),
        };
      } else if (unitIndex === -1) {
        objIng = {
          count: 1,
          unit: '',
          ingredient,
        };
      }

      return objIng;
    });

    this.ingredients = newIngredients;
  }

  updateServings(type) {
    // New servings
    const newServings = type === 'dec' ? this.servings - 1 : this.servings + 1;
    // Mutating ingredients count number according to the type of the clicked button
    this.ingredients.forEach(
      (ing) => (ing.count *= newServings / this.servings)
    );
    // Updating the servings
    this.servings = newServings;
  }
}
