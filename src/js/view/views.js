import icons from '../../img/icons.svg';

///////////////////////////////////////////////////////////////////////////////////
class View
{
    renderSpinner(parentEl)//adds a spinner inside given element
    {
        let r=0;
        parentEl.innerHTML='';
        parentEl.innerHTML=`<div class="spinner"><svg><use href="${icons}#icon-loader"></use></svg></div>`;
    }
}

export default View;