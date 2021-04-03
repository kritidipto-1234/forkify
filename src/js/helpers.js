import * as Model from './model.js';

function isBookmarked(recipe)
{
    return Model.bookmarks.some(r=>r.id==recipe.id);
}

function findBookmarked(recipeId)
{
    return Model.bookmarks.find(r=>r.id==recipeId);
}


export {isBookmarked,findBookmarked};