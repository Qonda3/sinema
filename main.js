
const options = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: `Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI1MGVkOWZhNzlhZGZmYzVlZDBlYWQ2OTQ0MzJmODlkYSIsIm5iZiI6MTcyMTM3ODA4My4wMzE2NjEsInN1YiI6IjY2OWEyMjIxM2YwNWQwZjc0MzUwMjFkYiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.kIIlVjgw_7TgQNrs0X7bFn8itRFZN1oFccQZZqTCqoM`
  }
};

function loadMovies(category) {
  const movieGrid = document.getElementById('movie-grid');
  movieGrid.innerHTML = '';

  document.querySelectorAll('.nav-links a').forEach(link => link.classList.remove('active'));
  document.getElementById(category).classList.add('active');

  fetch(`https://api.themoviedb.org/3/movie/${category}`, options)
    .then(response => response.json())
    .then(data => {
      data.results.forEach(movie => {
        const movieCard = document.createElement('div');
        movieCard.className = 'movie-card';
        movieCard.onclick = () => showMovieDetails(movie.id);

        const moviePoster = document.createElement('img');
        moviePoster.src = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
        moviePoster.alt = movie.title;

        const movieTitle = document.createElement('h2');
        movieTitle.textContent = movie.title;

        movieCard.appendChild(moviePoster);
        movieCard.appendChild(movieTitle);

        movieGrid.appendChild(movieCard);
      });
    })
    .catch(err => console.error(`Error fetching ${category} movies:`, err));
}

function showMovieDetails(movieId) {
  fetch(`https://api.themoviedb.org/3/movie/${movieId}?append_to_response=credits`, options)
    .then(response => response.json())
    .then(movie => {
      const modal = document.getElementById('movieModal');
      const modalTitle = document.getElementById('modalTitle');
      const modalBody = document.getElementById('modalBody');

      modalTitle.textContent = movie.title;
      modalBody.innerHTML = `
        <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}" class="modal-poster">
        <div class="modal-details">
          <p class="modal-info"><span>Rating:</span> ${movie.vote_average.toFixed(1)}/10</p>
          <p class="modal-info"><span>Genres:</span> ${movie.genres.map(genre => genre.name).join(', ')}</p>
          <p class="modal-info"><span>Director:</span> ${movie.credits.crew.find(person => person.job === 'Director')?.name || 'N/A'}</p>
          <p class="modal-info"><span>Writer:</span> ${movie.credits.crew.find(person => person.job === 'Screenplay')?.name || 'N/A'}</p>
          <p class="modal-info"><span>Cast:</span> ${movie.credits.cast.slice(0, 5).map(actor => actor.name).join(', ')}</p>
          <p class="modal-info"><span>Overview:</span> ${movie.overview}</p>
        </div>
      `;

      modal.style.display = 'block';
    })
    .catch(err => console.error('Error fetching movie details:', err));
}

const modal = document.getElementById('movieModal');
const closeBtn = document.getElementsByClassName('close')[0];

closeBtn.onclick = function() {
  modal.style.display = 'none';
}

window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = 'none';
  }
}

document.addEventListener('DOMContentLoaded', () => loadMovies('popular'));