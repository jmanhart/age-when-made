// Movie information returned by the movie search API
export interface Movie {
  id: number;
  title: string;
  release_date: string;
  overview: string;
  poster_path: string | null;
}

// Response format for movie search results
export interface MovieResponse {
  results: Movie[];
}

// Basic cast information returned by the credits endpoint
export interface Cast {
  id: number;
  name: string;
  character: string;
}

// Detailed actor information, extending Cast with additional fields
export interface Actor extends Cast {
  birthday: string | null; // Birthdate of the actor
  deathday: string | null; // Death date if the actor is deceased
  ageAtRelease: number | null; // Age at the time of the movie's release
  currentAge: number | null; // Actor's current age if still alive
  ageAtDeath: number | null; // Age at the time of death if deceased
}
