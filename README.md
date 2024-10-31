# Movie Search App

This is a Movie Search App built with Vite, React, and TypeScript. It allows users to search for movies, view detailed cast information, and displays each cast member's birthday, current age, age at release, and death information (if applicable).

Added in Vercel

## Features

- Search movies by title
- View movie cast and detailed actor information, including:
  - Birthday, deathday (if deceased)
  - Current age and age at release

## Prerequisites

- **Node.js** (version 14 or higher)
- **TMDb API Key**: Create a [TMDb](https://www.themoviedb.org/) account to obtain an API key.

## Project Setup

1. **Clone the repository**:

   ```bash
   git clone https://github.com/your-username/your-repo-name.git
   cd your-repo-name
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Set up environment variables**:

   Create a `.env` file in the root directory and add your TMDb API key:

   ```plaintext
   VITE_TMDB_API_KEY=YOUR_API_KEY_HERE
   ```

## Development

To start the development server:

```bash
npm run dev
```

This will start the Vite development server and open the app at `http://localhost:3000`.

## Build for Production

To build the project for production:

```bash
npm run build
```

The output will be in the `dist/` directory.

## Project Structure

```plaintext
src
├── components
│   ├── MovieSearch.tsx        # Main search component
│   ├── MovieList.tsx          # Component to list movies
│   ├── MovieItem.tsx          # Individual movie details with "View Cast" button
│   └── CastList.tsx           # Component to list cast members and their details
├── hooks
│   └── useFetch.ts            # Custom hook for fetching data (optional if using fetch functions directly)
├── utils
│   ├── calculateAge.ts        # Utility for age calculations
│   ├── api.ts                 # Centralized API request functions, including fetchCast
│   └── fetchActorDetails.ts   # Fetches individual actor details (e.g., birthday, deathday)
├── types
│   └── types.ts               # Define types for Movies, Cast, Actor, etc.
└── App.tsx                    # Main App component
```

## API Overview

- **`fetchMovies(query: string): Promise<Movie[]>`** - Fetches movies matching the search query.
- **`fetchMovieCast(movieId: number, releaseDate: string): Promise<Actor[]>`** - Fetches the cast of a movie, with details on each actor’s birthday, deathday, and calculated ages.

## Key Utility Functions

- **`calculateAgeAtDate(birthDate: string | null, targetDate: string): number | null`** - Calculates age at a specified date.
- **`fetchActorDetails(actorId: number): Promise<ActorDetails>`** - Fetches detailed information for a specific actor, including birthday and deathday.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
