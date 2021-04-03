const displayRecipe=document.querySelector('.displayRecipe');
const searchResults=document.querySelector('.searchResults');

//////////////////////////////////////////////////////////////
import icons from '../../img/icons.svg';
import  View from './views.js';
import DisplaySearchResults from './displaySearchResults.js';
import {Fraction} from 'fractional';
import {isBookmarked} from '../helpers.js';
import Bookmarks from './bookmark.js';
//////////////////////////////////////////////////////////////

class RecipeView extends View
{
    currentDisplayedRecipe;
    currentServings;

    constructor()
    {
        super();
        displayRecipe.addEventListener('click',this.incdecServings.bind(this));
    }

    renderSpinner()
    {
        super.renderSpinner(displayRecipe);
    }

    incdecServings(e)//updates no of servings and accordingly the ingredients
    {
        if (!e.target.closest('.incrementServing') && !e.target.closest('.decrementServing'))
            return;
        if (e.target.closest('.incrementServing'))
            this.currentServings++;
        if (e.target.closest('.decrementServing'))
            this.currentServings=Math.max(1,this.currentServings-1);//dont allow servings below 1
        this.renderServingsIngredients();
    }

    addHandler(task,parentDiv=searchResults)
    {
        parentDiv.addEventListener('click',async function(e)
        {
            const target=e.target.closest('a');
            if (!target) return;
            DisplaySearchResults.updateActiveSearchResultID(target.dataset.recipeid);
            DisplaySearchResults.displayActiveSearchResult();//keeping these just to avoid lag in update
            await task(target.dataset.recipeid);
        })
    }

    displayErrorMessage(e)
    {
        displayRecipe.innerHTML=`<div class="errorMessageResults" style="color:red;"><svg><use  href="${icons}#icon-alert-triangle"></use></svg>${e.message}</div>`;
    }

    renderServingsIngredients()//render all ingredients based on servings
    {
        const ingredientList=displayRecipe.querySelector('.ingredientList');
        displayRecipe.querySelector('.recipeServings').innerHTML=this.currentServings;
        const newMarkup=this.currentDisplayedRecipe.ingredients.reduce((acc,curr)=>acc+`<li style="display:flex;"><svg style="flex:1;" class="recipe__icon"><use href="${icons}#icon-check"></use></svg><span class="ingredientValue" style="flex:8;"> ${curr.quantity?curr.quantity/this.currentDisplayedRecipe.servings*this.currentServings:''} ${curr.unit} ${curr.description}</span></li>`,'');
        if ([...ingredientList.children].length==0) 
        {
            ingredientList.innerHTML=newMarkup;
            return;
        }
        const newDom=document.createRange().createContextualFragment(newMarkup);
        const newElements=[...newDom.querySelectorAll('*')];
        const currElements=[...ingredientList.querySelectorAll('*')];
        currElements.forEach((currE,i)=>
        {
            if (!currE.isEqualNode(newElements[i]) && currE.classList.contains('ingredientValue'))
               currE.textContent=newElements[i].textContent;
        });
    }
    
    render(recipeDetails)
    {
        DisplaySearchResults.updateActiveSearchResultID(recipeDetails.id);
        DisplaySearchResults.displayActiveSearchResult();
        Bookmarks.updateSelectedBookmarks();
        this.currentDisplayedRecipe=recipeDetails;
        this.currentServings=recipeDetails.servings;
        const displayedHtml=
        `
        <div class="foodImage"><img src="${recipeDetails.image_url}" onerror='this.style.display = "none"'></div>
        <div class="foodOptions">
            <div class="foodName">${recipeDetails.title}</div>
            <div class="options">
                <div><svg class="recipe__info-icon"><use href="${icons}#icon-clock"></use></svg> ${recipeDetails.cooking_time} MINUTES</div>
                <div>
                    <svg class="recipe__info-icon"><use href="${icons}#icon-users"></use></svg> 
                    <span class="recipeServings">${recipeDetails.servings}</span>&nbsp SERVINGS
                    <button class="decrementServing" type="button"><svg><use href="${icons}#icon-minus-circle"></use></svg></button>
                    <button class="incrementServing" type="button"><svg><use href="${icons}#icon-plus-circle"></use></svg></button>
                </div>
                <div class="${recipeDetails.key?'':'invisible'} recipeUserGenerated"><svg style="fill:white;"><use href="${icons}#icon-user"></use></svg></div>
                <button class="bookmark ${isBookmarked(recipeDetails)?'':'notbookmarked'}"  type="button"><svg style="fill:white;" class=""><use href="${icons}#icon-bookmark"></use></svg></button>
            </div>
        </div>
        <div class="ingredients">
            <h3>RECIPE INGREDIENTS</h3>
            <ul class="ingredientList">
            </ul>
        </div>
        <div class="moreInfo">
            <h3>HOW TO COOK IT</h3>
            <span>This recipe was carefully designed and tested by <b>${recipeDetails.publisher}</b>.</br> Please check out directions at their website.</span>
            <a target="_blank" href="${recipeDetails.source_url}">DIRECTIONS <svg style="fill:white;" class="search__icon"><use href="${icons}#icon-arrow-right"></use></svg></a>
        </div>`;
        displayRecipe.innerHTML='';
        displayRecipe.insertAdjacentHTML('afterbegin',displayedHtml);
        this.renderServingsIngredients();
    }
}

export default new RecipeView();
