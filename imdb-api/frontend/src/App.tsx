import { useState, useEffect } from 'react';
import './App.css';

// --- INTERFEJSY ---
interface Movie {
  movie_id: number;
  title: string;
  genres: string;
  year: number | null;
  img_url: string;
  rating_avg: number | string;
  rating_amount: number;
}

interface MoviesResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Movie[];
}

// Obrazek zastępczy
const PLACEHOLDER_IMG = "https://dummyimage.com/600x900/2a2a2a/888888.png&text=NO+IMAGE";

// --- KOMPONENT: WIDOK FILMÓW (Twój stary kod + przycisk powrotu) ---
function MoviesView({ onBack }: { onBack: () => void }) {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetch('http://localhost:8000/movies/')
      .then((response) => response.json())
      .then((data: MoviesResponse) => {
        setMovies(data.results);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Błąd:', error);
        setLoading(false);
      });
  }, []);

  const getRatingColor = (rating: number) => {
    if (rating >= 4.0) return 'high-rating';
    if (rating >= 2.5) return 'mid-rating';
    return 'low-rating';
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src = PLACEHOLDER_IMG;
    e.currentTarget.onerror = null;
  };

  if (loading) return <div className="loader">Ładowanie bazy filmów...</div>;

  return (
    <div>
      {/* Przycisk powrotu do Lobby */}
      <button className="back-button" onClick={onBack}>
        ← Wróć do Menu
      </button>

      <div className="movie-list">
        {movies.map((movie) => {
          const ratingNum = typeof movie.rating_avg === 'string' 
            ? parseFloat(movie.rating_avg) 
            : movie.rating_avg;

          const genreList = movie.genres ? movie.genres.split('|') : [];

          return (
            <div key={movie.movie_id} className="movie-card">
              <div className="image-container">
                <img 
                  src={movie.img_url || PLACEHOLDER_IMG} 
                  alt={movie.title}
                  onError={handleImageError}
                />
                <div className={`rating-badge ${getRatingColor(ratingNum as number)}`}>
                  ★ {Number(ratingNum).toFixed(1)}
                </div>
              </div>

              <div className="card-content">
                <h2>{movie.title}</h2>
                <div className="movie-meta">
                  <span className="year-badge">{movie.year || '???'}</span>
                  <span className="votes">{movie.rating_amount} gł.</span>
                </div>
                <div className="genres-container">
                  {genreList.slice(0, 3).map((g, index) => (
                    <span key={index} className="genre-tag">{g.trim()}</span>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// --- KOMPONENT: LOBBY (MENU) ---
function LobbyView({ onSelect }: { onSelect: (category: string) => void }) {
  // Lista przycisków zgodna z Twoim zdjęciem Api Root
  const categories = ['links', 'ratings', 'seasons', 'movies', 'tags'];

  return (
    <div className="lobby-container">
      <h2>Wybierz kategorię API</h2>
      <div className="lobby-grid">
        {categories.map((cat) => (
          <button 
            key={cat} 
            className="lobby-button"
            onClick={() => onSelect(cat)}
          >
            {cat.toUpperCase()}
          </button>
        ))}
      </div>
    </div>
  );
}

// --- GŁÓWNY KOMPONENT APP ---
function App() {
  // Stan decydujący co wyświetlamy: 'home' lub 'movies'
  const [currentView, setCurrentView] = useState<'home' | 'movies'>('home');

  const handleNavigate = (category: string) => {
    if (category === 'movies') {
      setCurrentView('movies');
    } else {
      alert(`Sekcja "${category}" nie jest jeszcze gotowa!`);
    }
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>🎬 MovieZone</h1>
        <p>Twoja kolekcja filmów Django & React</p>
      </header>

      {/* Warunkowe wyświetlanie */}
      {currentView === 'home' ? (
        <LobbyView onSelect={handleNavigate} />
      ) : (
        <MoviesView onBack={() => setCurrentView('home')} />
      )}
    </div>
  );
}

export default App;