import { elements } from './base';

export const getInput = () => elements.searchInput.value;

export const clearInput = () => (
elements.searchInput.value = '');

export const clearResults = () => {
    elements.searchResList.innerHTML = '';
    elements.searchResPages.innerHTML = '';
};

export const highLightSelected = id => 
{
    const resultArr = Array.from(document.querySelectorAll('.results__link'));
    resultArr.forEach(el => {
        el.classList.remove('results__link--active');
    });

    document.querySelector(`.results__link[href*="#${id}"]`).classList.add('results__link--active');
}

/**
 * pasta with tomato and spinach
 * acc 0 / acc + cur.length (pasta) = 5 newtitle = ['pasta']
 * acc 5 / acc + cur.length (with) = 9 newtitle = ['pasta' 'with']
 * acc 9 / acc + cur.length (tomato) = 15 newtitle = ['pasta' 'with' 'tomato']
 * acc 15 / acc + cur.length (and) 8 newtitle = ['pasta' 'with' 'tomato']
 * acc 18 / acc + cur.length (spinach) = 24 newtitle = ['pasta' 'with' 'tomato']
 */

export const limitRecipeTitle = (title, limit = 17) => {
    const newTitle =[];

    if (title.length > limit) {
        title.split(' ').reduce((prev, cur) => {
            if (prev + cur.length <= limit) {
                newTitle.push(cur);
            }
            return prev + cur.length;
        }, 0);
        return `${newTitle.join(' ')} ...`
    }
    return title;
};

const renderRecipe = recipe => {
    const markup = `
        <li class="res">
            <a class="results__link" href="#${recipe.recipe_id}">
                <figure class="results__fig">
                    <img src="${recipe.image_url}" alt="${recipe.title}">
                </figure>
                <div class="results__data">
                    <h4 class="results__name">${limitRecipeTitle(recipe.title)}</h4>
                    <p class="results__author">${recipe.publisher}</p>
                </div>
            </a>
        </li>
    `;

    elements.searchResList.insertAdjacentHTML('beforeend', markup);
};

// type = 'prev' or 'next'
const createButtons = (page, type) => `

    <button class="btn-inline results__btn--${type}" data-goto=${type === 'prev' ? page - 1 : page + 1}>
        <span>Page ${type === 'prev' ? page - 1 : page + 1}</span>    
        <svg class="search__icon">
            <use href="img/icons.svg#icon-triangle-${type === 'prev' ? 'left' : 'right'}"></use>
        </svg> 
    </button>
`;

const renderButtons = (page, numResults, resPerPage) => {
    const pages = Math.ceil(numResults / resPerPage);

    let button;
    if (page === 1 && pages > 1) {
        // only button go to next page
        button = createButtons(page, 'next');

    } else if (page < pages) {
        // both buttons
        button = `
            ${createButtons(page, 'prev')};
            ${createButtons(page, 'next')};
        `
    } else if (page === pages && pages > 1) {
        // only button go to prev page
        button = createButtons(page, 'prev');
    }

    elements.searchResPages.insertAdjacentHTML('afterbegin', button);
};

export const renderResults = (recipes, page = 1, resPerPage = 10) => {
    // Render result of current page
    const start = (page - 1) * resPerPage;
    const end = page * resPerPage;

    recipes.slice(start, end).forEach(renderRecipe);

    // Render the pagination
    renderButtons(page, recipes.length, resPerPage);

};