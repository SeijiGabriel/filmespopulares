import API_KEY from "./apiKey.js";

const MY_API_KEY = `api_key=${API_KEY}`;
const BASE_URL = 'https://api.themoviedb.org/3';
const API_URL = BASE_URL + '/discover/movie?sort_by=popularity.desc&' + MY_API_KEY;
const IMG_URL = 'https://image.tmdb.org/t/p/w500';
const searchURL = BASE_URL + '/search/movie?' + MY_API_KEY;
const section = document.querySelector(".container-card");
const search = document.querySelector(".search-bar")
const form = document.querySelector("form");

getMovies(API_URL);

function getMovies(url) {
    fetch(url).then(res => res.json()).then(data => {
        console.log(data.results);
        showMovies(data.results);
    })
}



function showMovies(data) {

    section.innerHTML = '';


    data.forEach(movie => {
        const { title, poster_path, vote_average, overview } = movie;
        const movieElement = document.createElement('div');
        movieElement.classList.add("card-wrapper");
        movieElement.innerHTML = `
                <img class="img-banner"
                    src="${IMG_URL + poster_path}"
                    alt="${title}">
                <div class="card-info">
                    <h3 class="movie-name">${title}</h3>
                    <div class="container-grade">
                        <div class="grade">
                            <span class="material-symbols-outlined star">
                                grade
                            </span>
                            <h3 class="score">${vote_average}</h3>
                        </div>
                        <div class="favorite">
                            <span class="material-symbols-outlined heart">
                                favorite
                            </span>
                            <h2 class="favorite-text">Favoritar</h2>
                        </div>
                    </div>
                </div>
                <h3 class="sinopse">${overview}</h3>
         `
        section.appendChild(movieElement);
        const heartIcon = movieElement.querySelector(".heart");
        heartIcon.addEventListener("click", () => {
            if(heartIcon.classList.contains("active")) {
                removeFavorite(movie);
            }else {
                addFavorite(movie);
            }
            heartIcon.classList.toggle("active");
        });
    })
    function removeFavorite(movie) {
        const favoriteMovies = JSON.parse(localStorage.getItem("favoriteMovies")) || [];
        const updatedFavorites = favoriteMovies.filter(favorite => favorite.id !== movie.id);
    
        localStorage.setItem("favoriteMovies", JSON.stringify(updatedFavorites));
    }

    function addFavorite(movie) {
        const favoriteMovies = JSON.parse(localStorage.getItem("favoriteMovies")) || [];
        const isAlreadyFavorited = favoriteMovies.some(favorite => favorite.id === movie.id);

        if (!isAlreadyFavorited) {
            favoriteMovies.push(movie);
            localStorage.setItem("favoriteMovies", JSON.stringify(favoriteMovies));
        }
    }
}



const searchIcon = document.querySelector(".search-icon");

searchIcon.addEventListener("click", () => {
    const searchTerm = document.querySelector(".search-bar").value;
    if (searchTerm) {
        getMovies(searchURL + '&query=' + searchTerm);
    } else {
        getMovies(API_URL);
    }
});



form.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        e.preventDefault();

        const searchTerm = search.value;
        if (searchTerm) {
            getMovies(searchURL + '&query=' + searchTerm)
        } else {
            getMovies(API_URL);
        }

    }

})

