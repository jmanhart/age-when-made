import { Movie, Actor } from "../types/types";

export const mockMovies: (Omit<Movie, "ageAtRelease"> & { type: "movie" })[] = [
  // Christopher Nolan Movies
  {
    id: 1,
    title: "Inception",
    poster_path: "/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg",
    release_date: "2010-07-16",
    overview:
      "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.",
    vote_average: 8.4,
    type: "movie",
  },
  {
    id: 2,
    title: "The Dark Knight",
    poster_path: "/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
    release_date: "2008-07-18",
    overview:
      "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.",
    vote_average: 8.9,
    type: "movie",
  },
  {
    id: 3,
    title: "Oppenheimer",
    poster_path: "/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg",
    release_date: "2023-07-21",
    overview:
      "The story of J. Robert Oppenheimer's role in the development of the atomic bomb during World War II.",
    vote_average: 8.2,
    type: "movie",
  },
  {
    id: 4,
    title: "Interstellar",
    poster_path: "/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
    release_date: "2014-11-07",
    overview:
      "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.",
    vote_average: 8.6,
    type: "movie",
  },
  {
    id: 5,
    title: "Dunkirk",
    poster_path: "/ebSnODDg9lbsMIaWg2uAbjn7TO5.jpg",
    release_date: "2017-07-21",
    overview:
      "Allied soldiers from Belgium, the British Empire, and France are surrounded by the German Army and evacuated during a fierce battle in World War II.",
    vote_average: 7.8,
    type: "movie",
  },
  // Quentin Tarantino Movies
  {
    id: 6,
    title: "Pulp Fiction",
    poster_path: "/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg",
    release_date: "1994-10-14",
    overview:
      "The lives of two mob hitmen, a boxer, a gangster and his wife, and a pair of diner bandits intertwine in four tales of violence and redemption.",
    vote_average: 8.9,
    type: "movie",
  },
  {
    id: 7,
    title: "Kill Bill: Vol. 1",
    poster_path: "/v7TaX8kXMXs5yFFGR41guUDNcnB.jpg",
    release_date: "2003-10-10",
    overview:
      "After awakening from a four-year coma, a former assassin wreaks vengeance on the team of assassins who betrayed her.",
    vote_average: 8.1,
    type: "movie",
  },
  {
    id: 8,
    title: "Django Unchained",
    poster_path: "/7oWY8VDWW7thTzWh3OKYRkWUlD5.jpg",
    release_date: "2012-12-25",
    overview:
      "With the help of a German bounty hunter, a freed slave sets out to rescue his wife from a brutal Mississippi plantation owner.",
    vote_average: 8.4,
    type: "movie",
  },
  {
    id: 9,
    title: "Inglourious Basterds",
    poster_path: "/7sfbEnaARXDDhKm0CZ7D7uc2sbo.jpg",
    release_date: "2009-08-21",
    overview:
      "In Nazi-occupied France during World War II, a plan to assassinate Nazi leaders by a group of Jewish U.S. soldiers coincides with a theatre owner's vengeful plans for the same.",
    vote_average: 8.3,
    type: "movie",
  },
  {
    id: 10,
    title: "Once Upon a Time in Hollywood",
    poster_path: "/8j58iEBw9pOXFD2L0nt0ZXeHviB.jpg",
    release_date: "2019-07-26",
    overview:
      "A faded television actor and his stunt double strive to achieve fame and success in the final years of Hollywood's Golden Age in 1969 Los Angeles.",
    vote_average: 7.4,
    type: "movie",
  },
];

export const mockActors: (Omit<Actor, "character"> & { type: "actor" })[] = [
  {
    id: 1,
    name: "Leonardo DiCaprio",
    profile_path: "/wo2hJpn04vbtmh0B9utCFdsQhxM.jpg",
    birthday: "1974-11-11",
    deathday: null,
    ageAtRelease: 36, // Age during Inception
    currentAge: 49,
    ageAtDeath: null,
    type: "actor",
  },
  {
    id: 2,
    name: "Christian Bale",
    profile_path: "/qCpZn2e3dimwbryLnqxZuI88PTi.jpg",
    birthday: "1974-01-30",
    deathday: null,
    ageAtRelease: 34, // Age during The Dark Knight
    currentAge: 50,
    ageAtDeath: null,
    type: "actor",
  },
  {
    id: 3,
    name: "Christopher Nolan",
    profile_path: "/xuAIuYSmsUzKlUMBFGVZaWsY3DZ.jpg",
    birthday: "1970-07-30",
    deathday: null,
    ageAtRelease: 53, // Age during Oppenheimer
    currentAge: 53,
    ageAtDeath: null,
    type: "actor",
  },
  {
    id: 4,
    name: "Quentin Tarantino",
    profile_path: "/1gjcpAa99FAOWGnrUvHEXXsRs7o.jpg",
    birthday: "1963-03-27",
    deathday: null,
    ageAtRelease: 56, // Age during Once Upon a Time in Hollywood
    currentAge: 60,
    ageAtDeath: null,
    type: "actor",
  },
  {
    id: 5,
    name: "Uma Thurman",
    profile_path: "/6NRlV9oUipeak7r00V6k73Jb7we.jpg",
    birthday: "1970-04-29",
    deathday: null,
    ageAtRelease: 33, // Age during Kill Bill
    currentAge: 53,
    ageAtDeath: null,
    type: "actor",
  },
  {
    id: 6,
    name: "Cillian Murphy",
    profile_path: "/dm6V24NjjvjMiCtbMkc8Y2WPm2e.jpg",
    birthday: "1976-05-25",
    deathday: null,
    ageAtRelease: 47, // Age during Oppenheimer
    currentAge: 47,
    ageAtDeath: null,
    type: "actor",
  },
];

// Combined suggestions type
export type Suggestion = (typeof mockMovies)[0] | (typeof mockActors)[0];

// Helper function to get combined suggestions
export const getMockSuggestions = () => [...mockMovies, ...mockActors];
