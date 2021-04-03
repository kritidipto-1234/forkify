const searchResults=document.querySelector('.searchResults');
const searchBtn=document.querySelector('.searchBtn');
const foodInput=document.querySelector('.foodSearch');

////////////////////////////////////////////////////////////////
import icons from '../../img/icons.svg';
import  View from './views.js';
/////////////////////////////////////////////////////////////////

class SearchResultsView extends View
{
    activeRecipeid;
    
    updateActiveSearchResultID(id)
    {
        this.activeRecipeid=id;
    }

    displayActiveSearchResult(parentDiv=searchResults)//to update currently active item in search list
    {
        if ([...parentDiv.children].length==0) return; //empty parent
        parentDiv.childNodes.forEach(e=>
        {
            e.classList.remove('selected');
            if (e.dataset.recipeid==this.activeRecipeid && e.classList.contains('resultItems'))
                e.classList.add('selected');
        });
    }

    renderSpinner()
    {
        super.renderSpinner(searchResults);
    }

    getSearchValue()
    {
        return foodInput.value;
    }

    displayErrorMessage(e)
    {
        searchResults.innerHTML=`<div class="errorMessageResults" style="color:red;"><svg><use  href="${icons}#icon-alert-triangle"></use></svg>${e.message}</div>`;
    }

    addHandler(task)
    {
        searchBtn.addEventListener('click',e=>{foodInput.blur();task();});
        foodInput.addEventListener('keydown',function(e)
        {
            if (e.key!=='Enter') return;
            foodInput.blur();
            task();
        });
    }

    makeSearchResultHTML(result)//returns HTML markup of one search result object
    {
        return `<a class="resultItems" class="${result.id===this.activeRecipeid?'':''}" href="javascript:void(0);" data-recipeid="${result.id}">
        <div class="recipeImage">
            <img src="${result.image_url}" onerror='this.style.display = "none"'   >
        </div>
        <div class="dishName">${result.title}</div>
        <div class="dishPublisher">${result.publisher}</div>
        <svg class="${result.key?'':'invisible '}recipe__icon"><use href="${icons}#icon-user"></use></svg>
        </a>`
    }

    render(recipes,buttonWrapper='',parentDiv=searchResults)//optional buttonwrapper for when called by paginator
    {
        // console.log(recipes[0]);
        parentDiv.innerHTML=recipes.reduce((acc,curr)=>acc+this.makeSearchResultHTML(curr),'')+buttonWrapper;
        this.displayActiveSearchResult(parentDiv);
    }
}
    
export default new SearchResultsView();
