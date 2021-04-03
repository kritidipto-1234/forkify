import * as Config from '../config.js';
import DisplaySearchResults from './displaySearchResults.js';
import icons from '../../img/icons.svg';

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
const searchResults=document.querySelector('.searchResults');

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
class pagination
{
    pageNo=1;
    recipes;//store whole search results recipes array
    paginate(recipes)
    {
        this.recipes=recipes;
        this.pageNo=1;
        if (recipes.length<=Config.paginationLength)//check if pagination at all required
            return;
        this.generateCurrentPage(this.recipes);
    }

    addButtonFunctionality()
    {
        document.querySelector('.paginateleft').addEventListener('click',(function()
        {
            this.pageNo--;
            this.generateCurrentPage.call(this);
        }).bind(this));
        document.querySelector('.paginateright').addEventListener('click',(function()
        {
            this.pageNo++;
            this.generateCurrentPage.call(this);
        }).bind(this));
    }

    generateCurrentPage()
    {
        const pageStart=(this.pageNo-1)*Config.paginationLength;
        const pageEnd=Math.min(pageStart+Config.paginationLength-1,this.recipes.length);
        DisplaySearchResults.render(this.recipes.slice(pageStart,pageEnd+1),this.generateButtons());
        this.addButtonFunctionality.call(this);
    }

    generateButtons()
    {
        return `<div class="paginateBtnWrapper">
            <button type="button" style="display:${this.pageNo===1?'none':''}" class="paginateleft"><svg><use href="${icons}#icon-arrow-left"></use></svg> Page ${this.pageNo-1}</button>
            <button type="button" style="display:${this.pageNo*Config.paginationLength>=this.recipes.length?'none':''}" class="paginateright"> Page ${this.pageNo+1}<svg><use href="${icons}#icon-arrow-right"></use></svg></button>
        </div>`;
    }
}

export default new pagination();
