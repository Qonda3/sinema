// Define options for the fetch request with method 'GET' and required headers.
const options = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: `Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI1MGVkOWZhNzlhZGZmYzVlZDBlYWQ2OTQ0MzJmODlkYSIsIm5iZiI6MTcyMTM3ODA4My4wMzE2NjEsInN1YiI6IjY2OWEyMjIxM2YwNWQwZjc0MzUwMjFkYiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.kIIlVjgw_7TgQNrs0X7bFn8itRFZN1oFccQZZqTCqoM`
  }
};

// Function to load movies based on the selected category.
function loadMovies(category) {
  const movieGrid = document.getElementById('movie-grid');
  movieGrid.innerHTML = ''; // Clear the movie grid

  // Remove the active class from all nav links and add it to the selected category.
  document.querySelectorAll('.nav-links a').forEach(link => link.classList.remove('active'));
  document.getElementById(category).classList.add('active');

  // Fetch movies from the selected category.
  fetch(`https://api.themoviedb.org/3/movie/${category}`, options)
    .then(response => response.json())
    .then(data => {
      // Iterate through the fetched movies and create movie cards.
      data.results.forEach(movie => {
        const movieCard = document.createElement('div');
        movieCard.className = 'movie-card';
        movieCard.onclick = () => showMovieDetails(movie.id); // Attach onclick event to show movie details.

        const moviePoster = document.createElement('img');
        moviePoster.src = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
        moviePoster.alt = movie.title;

        const movieTitle = document.createElement('h2');
        movieTitle.textContent = movie.title;

        // Append poster and title to the movie card, and the card to the grid.
        movieCard.appendChild(moviePoster);
        movieCard.appendChild(movieTitle);
        movieGrid.appendChild(movieCard);
      });
    })
    .catch(err => console.error(`Error fetching ${category} movies:`, err)); // Handle errors.
}

// Function to show movie details in a modal.
function showMovieDetails(movieId) {
  // Fetch movie details along with the credits information.
  fetch(`https://api.themoviedb.org/3/movie/${movieId}?append_to_response=credits`, options)
    .then(response => response.json())
    .then(movie => {
      const modal = document.getElementById('movieModal');
      const modalTitle = document.getElementById('modalTitle');
      const modalBody = document.getElementById('modalBody');

      // Populate the modal with movie details.
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

      modal.style.display = 'block'; // Show the modal.
    })
    .catch(err => console.error('Error fetching movie details:', err)); // Handle errors.
}

// Get modal and close button elements.
const modal = document.getElementById('movieModal');
const closeBtn = document.getElementsByClassName('close')[0];

// Close the modal when the close button is clicked.
closeBtn.onclick = function() {
  modal.style.display = 'none';
}

// Close the modal when clicking outside of it.
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = 'none';
  }
}

// Load popular movies when the document is loaded.
document.addEventListener('DOMContentLoaded', () => loadMovies('popular'));
