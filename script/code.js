const api = axios.create({
    baseURL: 'https://api.themoviedb.org/3/',
    headers: {
        'Content-Type': 'application/json;charset=utf-8'
    },
    params: {
        'api_key': API_KEY,
    }
});

window.onload = function () {
    location.hash = "#home";
    homePage();
}

function createMovies(movies, genericList) {
    genericList.innerHTML = "";

    const moviesList = document.createElement('DIV');
    moviesList.classList.add('movies', 'vertical-movies-container');

    movies.forEach(movie => {
        const movieDiv = document.createElement('DIV');
        movieDiv.classList.add('movie', 'vertical-movie');
        movieDiv.addEventListener('click', () => {
            location.hash = '#movie=' + movie.id;
            moviePage();
        });
        const image = document.createElement('IMG');
        image.classList.add('movie-image');
        image.setAttribute('alt', movie.title);
        image.setAttribute('src', "https://image.tmdb.org/t/p/w300" + movie.poster_path);

        movieDiv.appendChild(image);
        moviesList.appendChild(movieDiv);
        genericList.appendChild(moviesList);
    });
}

async function getTrendingMoviesPreview() {
    const { data } = await api('trending/movie/day');

    const movies = data.results;
    const moviesList = document.createElement('DIV');
    moviesList.classList.add('movies', 'trending-movies');

    trendingPreviewSection.innerHTML = "";

    movies.forEach(movie => {
        const movieDiv = document.createElement('DIV');
        movieDiv.classList.add('movie', 'trending-movie');
        
        movieDiv.addEventListener('click', () => {
            location.hash = '#movie=' + movie.id;
            moviePage();
        });

        const image = document.createElement('IMG');
        image.classList.add('movie-image');
        image.setAttribute('alt', movie.title);
        image.setAttribute('src', "https://image.tmdb.org/t/p/w300" + movie.poster_path);

        movieDiv.appendChild(image);
        moviesList.appendChild(movieDiv);
        trendingPreviewSection.appendChild(moviesList);    
    });

    const seeMore = document.createElement('DIV');
    seeMore.classList.add('see-more');
    seeMoreIcon.classList.add('icon', 'see-more__icon');
    seeMore.appendChild(seeMoreIcon);
    moviesList.appendChild(seeMore);
}

async function getCategories() {
    const { data } = await api('genre/movie/list');

    const categories = data.genres;
    const categoriesMenu = document.getElementById('categories-menu');

    categoriesMenu.innerHTML = "";

    categories.forEach(category => {
        const category_ele = document.createElement('A');
        category_ele.classList.add('menu-list__category');
        const categoryName = document.createTextNode(category.name);
        category_ele.appendChild(categoryName);
        categoriesMenu.appendChild(category_ele);
        category_ele.addEventListener('click', () => {
            location.hash = `#category=${category.id}-${category.name}`;
            closeNav();
        })
    });
}

async function getMoviesByCategory(id) {
    const { data } = await api('discover/movie', {
        params: {
            with_genres: id
        }
    });

    const movies = data.results;
    createMovies(movies, categoryMovies);
    categorySection.appendChild(categoryMovies);
}

async function getMoviesBySearch(query) {
    const { data } = await api('search/movie', {
        params: {
            query
        }
    });

    const movies = data.results;
    createMovies(movies, searchMovies);
    searchSection.appendChild(searchMovies);
}

async function getTrendingMovies() {
    const { data } = await api('trending/movie/day');

    const movies = data.results;
    createMovies(movies, trendsMovies);
    trendsSection.appendChild(trendsMovies);
}

async function getMovieById(id) {
    movieCategories.innerHTML = "";
    var categories = [];
    var item;
    const { data: movie } = await api('movie/' + id);

    moviePreview.style.backgroundImage = `url('https://image.tmdb.org/t/p/w300${movie.poster_path}')`;
    movieTitle.textContent = movie.title;
    movieRate.textContent = movie.vote_average;
    movieDescription.textContent = movie.overview;

    // for (let i = 0; i < movie.genres.length; i++) {
    //     categories.push(movie.genres[i].name);
    // }

    // categories.forEach((category) => {
    //     item = document.createElement("LI");
    //     item.textContent = category;
    //     movieCategories.appendChild(item);
    // });

    // console.log(movie.genres); 

    getRelatedMoviesId(id);
}

async function getRelatedMoviesId(id) {
    const { data } = await api(`movie/${id}/recommendations`);
    const relatedMovies = data.results;

    recommendSection.innerHTML = "";
    // const moviesList = document.createElement('DIV');
    // moviesList.classList.add('movies', 'recomend-section');

    relatedMovies.forEach(movie => {
        const movieDiv = document.createElement('DIV');
        movieDiv.classList.add('recomend-movie');
        movieDiv.addEventListener('click', () => {
            location.hash = '#movie=' + movie.id;
            moviePage();
            movieSection.scroll(0,0);
        });
        const image = document.createElement('IMG');
        image.classList.add('movie-image');
        image.setAttribute('alt', movie.title);
        image.setAttribute('src', "https://image.tmdb.org/t/p/w300" + movie.poster_path);

        movieDiv.appendChild(image);
        // moviesList.appendChild(movieDiv);
        // recommendSection.appendChild(moviesList);
        recommendSection.appendChild(movieDiv);
    });
}

function openNav() {
    sideNav.style.width = "300px";
}

function closeNav() {
    sideNav.style.width = "0px";
}

function closeMovieSection() {
    movieSection.classList.add('inactive');
}

bannerHome.addEventListener('click', () => {
    homePage();
    location.hash = "#home";
})