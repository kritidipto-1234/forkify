import icons from '../../img/icons.svg';
import DisplayRecipe from './displayRecipe.js';
import * as Model from '../model.js';
import {findBookmarked} from '../helpers.js';
import DisplaySearchResults from './displaySearchResults.js';
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
const bookmarkBtn=document.querySelector('.bookmarkBtn');
const bookmarksElement=document.querySelector('.bookmarks');
const displayRecipe=document.querySelector('.displayRecipe');
///////////////////////////////////////////////////////////////////////////////////////////////

class Bookmark
{
    updateSelectedBookmarks()
    {
        DisplaySearchResults.displayActiveSearchResult(bookmarksElement);
    }

    addHandler()
    {
        [bookmarkBtn,bookmarksElement].forEach(e=>e.addEventListener('mouseenter',(function()
        {
            bookmarksElement.style.display='block';
        }).bind(this)));
        [bookmarkBtn,bookmarksElement].forEach(e=>e.addEventListener('mouseleave',(function()
        {
            bookmarksElement.style.display='none';
        }).bind(this)));    
        displayRecipe.addEventListener('click',(function(e)
        {
            const button=e.target.closest('.bookmark');
            if (!button)
                return;
            if (button.classList.contains('notbookmarked'))
                Model.addBookmark(DisplayRecipe.currentDisplayedRecipe);
            else 
                Model.removeBookmark(DisplayRecipe.currentDisplayedRecipe);
            button.classList.toggle('notbookmarked');
            this.render();
        }).bind(this));
        bookmarksElement.addEventListener('click',(function(e)
        {
            const target=e.target.closest('a');
            if (!target) return;
            DisplaySearchResults.updateActiveSearchResultID(target.dataset.recipeid);
            const recipe=findBookmarked(target.dataset.recipeid);
            DisplayRecipe.render(recipe);
        }).bind(this));
    }

    render()
    {
        if (Model.bookmarks.length===0)
        {
            bookmarksElement.innerHTML=
            `<div class="bookmarkMessage">
                <svg><use href="${icons}#icon-alert-triangle"></use></svg>
                No bookmarks yet. Find a nice recipe and bookmark it. On a displayed recipe click the hollow yellow circle to bookmark.Click again to Un-Bookmark
            </div>`;
            return;
        }
        DisplaySearchResults.render(Model.bookmarks,'',bookmarksElement);
    }
}

export default new Bookmark();
