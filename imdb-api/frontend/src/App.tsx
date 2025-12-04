import { useState, useEffect } from 'react';
import './App.css';

// 1. Definiujemy kształt pojedynczego filmu (na podstawie Twojego PDF, np. strona 2)
interface Movie {
  movie_id: number;
  title: string;
  genres: string;
  year: number | null; // W source: 122 widać, że rok może być nullem
  img_url: string;
  rating_avg: number | string; // Czasem przychodzi jako liczba, czasem string
  rating_amount: number;
}

// 2. Definiujemy kształt odpowiedzi z Django REST Framework (paginacja)
interface MoviesResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Movie[]; // To jest lista filmów, która nas interesuje
}

function App() {
  // Tutaj mówimy Reactowi, że 'movies' to będzie tablica obiektów typu Movie
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetch('http://localhost:8000/movies/')
      .then((response) => response.json())
      .then((data: MoviesResponse) => {
        // Django zwraca dane w polu "results" 
        setMovies(data.results);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Błąd pobierania danych:', error);
        setLoading(false);
      });
  }, []);

  if (loading) return <h1>Ładowanie filmów...</h1>;

  return (
    <div className="app-container">
      <h1>Baza Filmów (Django + React TS)</h1>
      <div className="movie-list">
        {movies.map((movie) => (
          <div key={movie.movie_id} className="movie-card">
            {/* Obrazek - używamy pola img_url z backendu */}
            {movie.img_url ? (
              <img 
                src={movie.img_url} 
                alt={movie.title} 
                style={{ width: "150px", height: "auto" }} 
              />
            ) : (
              <div style={{width: "150px", height: "200px", background: "#ccc"}}>Brak zdjęcia</div>
            )}
            
            <h2>{movie.title}</h2>
            
            <p><strong>Rok:</strong> {movie.year || 'Nieznany'}</p>
            <p><strong>Gatunek:</strong> {movie.genres}</p>
            
            <p>
              <strong>Ocena:</strong> {movie.rating_avg} 
              <span style={{ fontSize: '0.8em', color: '#666' }}> ({movie.rating_amount} głosów)</span>
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;