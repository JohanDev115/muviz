const api = axios.create({
    baseURL: 'https://api.themoviedb.org/3/',
    headers: {
        'Content-Type': 'application/json;charset=utf-8'
    },
    params: {
        'api_key': API_KEY,
    }
});

function likedMovieList() {
    const item = JSON.parse(localStorage.getItem('liked_movies'));
    let movies;

    if (item) {
        movies = item;
    } else {
        movies = {};
    }

    return movies;
}

function likeMovie(movie) {
    const likedMovies = likedMovieList();
    console.log(likedMovies);
    if (likedMovies[movie.id]) {
        console.log('This movie is not in favorite list anymore');
        likedMovies[movie.id] = undefined;
    } else {
        console.log('This movie is now in favorite list');
        likedMovies[movie.id] = movie;
    }
    localStorage.setItem('liked_movies', JSON.stringify(likedMovies));
}

// window.onload = function() {
//     location.hash = "#home";
// }

const lazyLoader = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            const url = entry.target.getAttribute('data-img');
            entry.target.setAttribute('src', url);
        }
    });
})

function createMovies(movies, genericList, cleanData = true, align = 'movie--vertical') {

    if (cleanData) {
        genericList.innerHTML = "";
    }

    const moviesList = document.createElement('DIV');
    moviesList.classList.add('movies','vertical-movies-container');

    movies.forEach(movie => {
        const movieDiv = document.createElement('DIV');
        movieDiv.classList.add('movie', align);

        movieDiv.addEventListener('click', () => {
            location.hash = '#movie=' + movie.id;
        });

        const movieImg = document.createElement('IMG');
        movieImg.classList.add('movie-image');
        movieImg.setAttribute('alt', movie.title);
        movieImg.setAttribute('data-img', "https://image.tmdb.org/t/p/w300" + movie.poster_path);
        movieImg.addEventListener('error', () => {
            movieImg.parentElement.style.animationName = "none";
            movieImg.parentElement.style.backgroundColor = "rgb(208 47 47)";
            const movieName = document.createElement('P');
            movieName.classList.add('movie-name');
            movieName.textContent = movieImg.alt;
            movieDiv.appendChild(movieName);
            movieImg.remove();
        });

        lazyLoader.observe(movieImg);

        movieDiv.appendChild(movieImg);
        genericList.appendChild(movieDiv);
    });
}

async function getTrendingMoviesPreview() {
    const { data } = await api('trending/movie/day');
    const movies = data.results;
    const maxPage = data.total_pages;

    createMovies(movies, trendingPreviewList, true,'movie--horizontal');

    const seeMore = document.createElement('DIV');
    const seeMoreIcon = document.createElement('DIV');
    seeMore.classList.add('see-more');
    seeMoreIcon.classList.add('icon', 'see-more__icon');
    seeMore.appendChild(seeMoreIcon);
    trendingPreviewList.appendChild(seeMore);
    seeMoreIcon.addEventListener('click', () => {
        trendsPage();
    });
}

async function getCategories() {
    const { data } = await api('genre/movie/list');

    const maxPage = data.total_pages;
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

    maxPage = data.total_pages;
    const movies = data.results;
    createMovies(movies, categoryMovieList);
}

function getPaginatedCategoryMovies(id) {
    return async function () {
        const {
            scrollTop, 
            scrollHeight, 
            clientHeight
        } = document.documentElement;
        
        const scrollIsAtBottom = (clientHeight + scrollTop) >= scrollHeight;
    
        if (scrollIsAtBottom) {
            page++;
            console.log(page);
            const { data } = await api('discover/movie', {
                params: {
                    page
                }
            });
    
            const movies = data.results;
            createMovies(movies, categoryMovieList, false);
        }
    }
};

async function getMoviesBySearch(query) {
    const { data } = await api('search/movie', {
        params: {
            query
        }
    });

    const movies = data.results;
    createMovies(movies, searchMovieList);
}

function getPaginatedSearchMovies(query) {
    return async function () {
        const {
            scrollTop, 
            scrollHeight, 
            clientHeight
        } = document.documentElement;
        
        const scrollIsAtBottom = (clientHeight + scrollTop) >= scrollHeight;
    
        const pageIsNotMax = page < maxPage;
    
        if (scrollIsAtBottom && pageIsNotMax) {
            page++;
            console.log(page);
            const { data } = await api('search/movie', {
                params: {
                    query,
                    page
                }
            });
    
            const movies = data.results;
            createMovies(movies, searchMovieList, false);
        }
    }
};

async function getTrendingMovies() {
    const { data } = await api('trending/movie/day');

    maxPage = data.total_pages;
    const movies = data.results;
    createMovies(movies, trendsMovies);
};

async function getPaginatedTrendingMovies() {
    const {
        scrollTop, 
        scrollHeight, 
        clientHeight
    } = document.documentElement;
    
    const scrollIsAtBottom = (clientHeight + scrollTop) >= scrollHeight;

    const pageIsNotMax = page < maxPage;

    if (scrollIsAtBottom && pageIsNotMax) {
        page++;
        console.log(page);
        const { data } = await api('trending/movie/day', {
            params: {
                page
            }
        });

        const movies = data.results;
        createMovies(movies, trendsMovies, false);
    }
};

async function getMovieById(id) {
    movieSection.style.backgroundImage = "url()";
    movieTitle.textContent = "The Movie Title";
    movieRate.textContent = "0";
    movieDescription.textContent = "Lorem ipsum dolor sit amet consectetur adipisicing elit. Eaque mollitia iure assumenda exercitationem nemo officia? Eligendi quisquam porro ducimus earum, distinctio consequuntur libero harum natus exercitationem mollitia unde totam numquam.";

    const { data: movie } = await api('movie/' + id);

    movieSection.style.backgroundImage = `url('https://image.tmdb.org/t/p/w300${movie.poster_path}')`;
    movieTitle.textContent = movie.title;
    movieRate.textContent = movie.vote_average;
    movieDescription.textContent = movie.overview;

    getMovieCategories(id);
    getRelatedMoviesId(id);

    // const favoriteBtn = document.createElement('P');
    // favoriteBtn.setAttribute('id', 'favorite-button');
    // favoriteBtn.classList.add('favorite-button', 'icon', movie.id);

    // favoriteBtn.addEventListener('click', (evt) => {
    //     favoriteBtn.classList.toggle('favorite-button--linked');
    //     likeMovie(movie);
    // });

    // document.querySelector('#header-description').appendChild(favoriteBtn);

    // window.addEventListener('hashchange', () => {
    //     if (location.hash != '#movie=') {

    //     }
    // });
}

async function getMovieCategories(id) {
    movieCategories.innerHTML = "";
    var categories = [];
    var item;

    const { data: movie } = await api('movie/' + id);

    for (let i = 0; i < movie.genres.length; i++) {
        categories.push(movie.genres[i].name);
    }

    categories.forEach((category) => {
        item = document.createElement("LI");
        item.textContent = category;
        movieCategories.appendChild(item);
    });
}

async function getRelatedMoviesId(id) {
    const { data } = await api(`movie/${id}/recommendations`);
    const relatedMovies = data.results;
    createMovies(relatedMovies, recommendSection, "recomend-movie");
}

function openNav() {
    sideNav.style.width = "300px";
}

function closeNav() {
    sideNav.style.width = "0px";
}

function closeMovieSection() {
    movieSection.classList.add('inactive');
    history.back();
}

bannerHome.addEventListener('click', () => {
    location.hash = "#home";
});