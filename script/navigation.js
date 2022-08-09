let maxPage;
let page = 1;
let infiniteScroll;

window.addEventListener('DOMContentLoaded', navigator, false);
window.addEventListener('hashchange', navigator, false);
window.addEventListener('scroll', infiniteScroll, false);

backArrow.addEventListener('click', () => {
    history.back();
    scrollTo(0, 0);
});

function navigator() {
    page = 1;

    if (infiniteScroll) {
        window.removeEventListener('scroll', infiniteScroll, {
            passive: false
        });
        infiniteScroll = undefined;
    }

    if (location.hash.startsWith('#trends')) {
        trendsPage();
    } else if (location.hash.startsWith('#search=')){
        searchPage();
    } else if (location.hash.startsWith('#movie=')){
        moviePage();
    } else if (location.hash.startsWith('#category=')){
        categoriesPage();
    } else {
        homePage();
    }

    if (infiniteScroll) {
        window.addEventListener('scroll', infiniteScroll, false);
    }
}

searchIcon.addEventListener('click', (evt) => {
    searchResult.textContent = `: ${searchInput.value}`;

    if (searchInput.value == "") {
        location.hash = "#home";
    }
    location.hash = "#search=" + searchInput.value;
});

function showSection(sections) {
    sections.forEach(section => {
        section.classList.remove('inactive');
    });
}

function hideSection(sections) {
    sections.forEach(section => {
        section.classList.add('inactive');
    });
}

function homePage() {;
    showSection([welcomeSection, trendingPreviewSection, loadMoreContent]);
    hideSection([categorySection, backArrow, searchSection, movieSection, trendsSection]);

    getTrendingMoviesPreview();
    getCategories();
    searchInput.value = "";
}

function categoriesPage() {
    showSection([categorySection, backArrow]);
    hideSection([welcomeSection, trendingPreviewSection, favoriteMoviesSection, searchSection, movieSection, trendsSection]);

    const [_, categoryData] = location.hash.split('=');
    const [categoryId, categoryName] = categoryData.split('-');

    getMoviesByCategory(categoryId);
    categoryTitle.innerText = categoryName;
    scrollTo(0,0);
    infiniteScroll = getPaginatedCategoryMovies(categoryId);
}

function moviePage() {
    showSection([movieSection, backArrow]);
    hideSection([welcomeSection, trendingPreviewSection, favoriteMoviesSection, categorySection, searchSection, trendsSection, loadMoreContent]);

    const [_, movieId] = location.hash.split('=');
    getMovieById(movieId);
    scrollTarget.scrollIntoView({
        behavior: "instant"
    });
}

function searchPage() {
    showSection([searchSection, backArrow]);
    hideSection([welcomeSection, trendingPreviewSection, favoriteMoviesSection, categorySection, movieSection, trendsSection, loadMoreContent]);

    searchSection.scroll(0, 0);
    const [_, query] = location.hash.split('=');
    getMoviesBySearch(query);
    infiniteScroll = getPaginatedSearchMovies(query);
}

function trendsPage() {
    location.hash = '#trends';
    showSection([trendsSection, backArrow]);
    hideSection([welcomeSection, trendingPreviewSection, favoriteMoviesSection, categorySection, movieSection, searchSection, loadMoreContent]);
    
    getTrendingMovies();
    infiniteScroll = getPaginatedTrendingMovies;
}