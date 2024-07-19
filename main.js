document.addEventListener('DOMContentLoaded', () => {
    const movieDataElement = document.getElementById('movie-data');
  
    const apiKey = '50ed9fa79adffc5ed0ead694432f89da';
  
    fetch(`https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}`)
      .then(response => response.json())
      .then(data => {
        const formattedData = {
          page: data.page,
          results: data.results.map(movie => ({
            poster_path: movie.poster_path,
            adult: movie.adult,
            overview: movie.overview,
            release_date: movie.release_date,
            genre_ids: movie.genre_ids,
            id: movie.id,
            original_title: movie.original_title,
            original_language: movie.original_language,
            title: movie.title,
            backdrop_path: movie.backdrop_path,
            popularity: movie.popularity,
            vote_count: movie.vote_count,
            video: movie.video,
            vote_average: movie.vote_average
          })),
          total_pages: data.total_pages,
          total_results: data.total_results
        };
  
        movieDataElement.textContent = JSON.stringify(formattedData, null, 2);
      })
      .catch(err => console.error(err));
  });
  