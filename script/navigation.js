seeMoreIcon.addEventListener('click', () => {
    location.hash = "#trends";
});

searchInput.addEventListener('input', (evt) => {
    location.hash = "#search=" + searchInput.value;

    if (searchInput.value == "") {
        location.hash = "#home";
        homePage();
    }
});

window.addEventListener('DOMContentLoaded', navigator, false);
window.addEventListener('hashchange', navigator, false);

function navigator() {

    if (location.hash.startsWith('#trends')) {
        trendsPage();
    } else if (location.hash.startsWith('#search=')){
        SearchPage();
    } else if (location.hash.startsWith('#movie=')){
        moviePage();
    } else if (location.hash.startsWith('#category=')){
        CategoriesPage();
    } else {
        homePage();
    }
}

function homePage() {

    welcomeSection.classList.remove('inactive');
    trendingPreviewSection.classList.remove('inactive');
    categorySection.classList.add('inactive');
    searchSection.classList.add('inactive');
    trendsSection.classList.add('inactive');
    lcm.classList.remove('inactive');
    movieSection.classList.add('inactive');

    getTrendingMoviesPreview();
    getCategories();
}

function CategoriesPage() {

    welcomeSection.classList.add('inactive');
    trendingPreviewSection.classList.add('inactive');
    categorySection.classList.remove('inactive');
    searchSection.classList.add('inactive');
    trendsSection.classList.add('inactive');
    lcm.classList.add('inactive');

    const [_, categoryData] = location.hash.split('=');
    const [categoryId, categoryName] = categoryData.split('-');

    getCategories();

    getMoviesByCategory(categoryId);
    categoryTitle.innerText = categoryName;
    scrollTo(0,0);
}

function moviePage() {
    movieSection.classList.remove('inactive');
    lcm.classList.add('inactive');
    
    const [_, movieId] = location.hash.split('=');
    getMovieById(movieId);
}

function SearchPage() {
    welcomeSection.classList.add('inactive');
    trendingPreviewSection.classList.add('inactive');
    searchSection.classList.remove('inactive');
    categorySection.classList.add('inactive');
    trendsSection.classList.add('inactive');
    lcm.classList.add('inactive');

    getCategories();

    const [_, query] = location.hash.split('=');
    getMoviesBySearch(query);
}

function trendsPage() {
    welcomeSection.classList.add('inactive');
    trendingPreviewSection.classList.add('inactive');
    trendsSection.classList.remove('inactive');
    categorySection.classList.add('inactive');
    searchSection.classList.add('inactive');
    lcm.classList.add('inactive');

    console.log('TRENDS!');
    getCategories();

    getTrendingMovies();
}