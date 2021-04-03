import "regenerator-runtime/runtime.js";
import 'core-js/stable';
import {Fraction} from 'fractional';
import * as Config from './config.js';
import * as Model from './model.js';
import DisplayRecipe from './view/displayRecipe.js';
import DisplaySearchResults from './view/displaySearchResults.js';
import Pagination from './view/pagination.js';
import Bookmark from './view/bookmark.js';
import AddRecipe from './view/addRecipe.js';
/////////////////////////////////////////////////////////////
// APPLICATION LOGIC
///////////////////////////////////////////////////////////////////////

async function fetchRecipes()
{
    try
    {
        DisplaySearchResults.renderSpinner();
        const food=DisplaySearchResults.getSearchValue();
        const data=await Model.getJSONdata(`${Config.url}?search=${food}&key=${Config.key}`);
        const recipes=data.data.recipes;
        if (recipes.length===0)
            throw new Error('No recipes found');
        DisplaySearchResults.render(recipes);
        Pagination.paginate(recipes);
    }
    catch(e)
    {
        DisplaySearchResults.displayErrorMessage(e);
    }
}

async function renderRecipe(recipeid)
{
    try
    {
        DisplayRecipe.renderSpinner();
        const data=await Model.getJSONdata(`${Config.url}/${recipeid}?key=${Config.key}`);
        const recipeDetails=data.data.recipe;
        DisplayRecipe.render(recipeDetails);
    }
    catch(e)
    {
        DisplayRecipe.displayErrorMessage(e);
    }
}

function init()
{
    Model.loadBookmarks();
    DisplaySearchResults.addHandler(fetchRecipes);
    DisplayRecipe.addHandler(renderRecipe);
    Bookmark.addHandler();
    Bookmark.render();
    AddRecipe.addHandler(Model.sendJSONdata);
}
init();
