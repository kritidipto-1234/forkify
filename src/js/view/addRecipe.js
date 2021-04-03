const addRecipeBtn=document.querySelector('.addRecipeBtn');
const recipeForm=document.querySelector('.formOverlay');
const closeBtn=document.querySelector('.formCloseBtn');
const uploadBtn=document.querySelector('.uploadBtn');
const titleInput=document.querySelector('.titleInput');
const urlInput=document.querySelector('.urlInput');
const imageUrlInput=document.querySelector('.imageUrlInput');
const publisherInput=document.querySelector('.publisherInput');
const timeInput=document.querySelector('.timeInput');
const servingInput=document.querySelector('.servingInput');
const ingredientList=document.querySelector('.ingredientList');
const ingredientNodes=[...ingredientList.querySelectorAll('.ingredient')];
const submitMessage=document.querySelector('.submitMessage');


/////////////////////////////////////////////////////////////////////////////////////////
import View from './views.js';
import DisplayRecipe from './displayRecipe.js';
/////////////////////////////////////////////////////////////////////////////////////////

class addRecipeView extends View
{
    globalTimer=undefined;
    addHandler(task)
    {
        addRecipeBtn.addEventListener('click',function()
        {
            recipeForm.classList.remove('hidden');
        });
        recipeForm.addEventListener('click',(function(e)
        {
            if (e.target!==recipeForm) return;
            recipeForm.classList.add('hidden');
            this.clearForm();
        }).bind(this));
        closeBtn.addEventListener('click',(function()
        {
            recipeForm.classList.add('hidden');
            this.clearForm();
        }).bind(this));
        uploadBtn.addEventListener('click',(async function()
        {
            submitMessage.classList.remove('hidden');
            this.renderSpinner(submitMessage);
            clearTimeout(this.globalTimer);
            await this.uploadRecipe(task);
        }).bind(this));
    }

    clearForm()
    {
        [...recipeForm.querySelectorAll('input')].forEach(e=>e.value='');
    }

    getIngredients()
    {
        return ingredientNodes.map(e=>
            ({
                quantity:Number(e.querySelector('.quantity').value)||null,
                unit:e.querySelector('.unit').value,
                description:e.querySelector('.description').value
            })
        ).filter(e=>e.quantity||e.unit||e.description);
    }

    getFormData()
    {
        const newRecipe=
        {
            cooking_time:Number(timeInput.value),
            image_url:imageUrlInput.value,
            ingredients:this.getIngredients(),
            publisher:publisherInput.value,
            servings:Number(servingInput.value),
            source_url:urlInput.value,
            title:titleInput.value
        };
        return newRecipe;
    }

    displayError(e)
    {
        const errorMessage=e.message.split('..')[0];
        submitMessage.innerHTML=errorMessage;
        submitMessage.classList.remove('hidden');
        clearTimeout(this.globalTimer);
        this.globalTimer=setTimeout(()=>submitMessage.classList.add('hidden'),4000);
    }

    async uploadRecipe(task)
    {
        try
        {
            const newRecipe=this.getFormData();
            this.clearForm();
            const data=await task(newRecipe);
            if (data.status==='success')
            {
                submitMessage.textContent=data.status;
                submitMessage.classList.remove('hidden');
                clearTimeout(this.globalTimer);
                this.globalTimer=setTimeout(()=>submitMessage.classList.add('hidden'),2000);
                DisplayRecipe.render(data.data.recipe);
            }
        }
        catch(e)
        {
            this.displayError(e);
        }
    }
}

export default new addRecipeView();