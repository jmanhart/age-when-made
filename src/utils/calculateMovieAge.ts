/**
 * Calculates the age of a movie based on its release date.
 * @param releaseDate - The release date of the movie in "YYYY-MM-DD" format
 * @returns The age of the movie in years, or "N/A" if releaseDate is undefined
 */
const calculateMovieAge = (
  releaseDate: string | undefined
): string | number => {
  if (!releaseDate) return "N/A";
  const releaseYear = new Date(releaseDate).getFullYear();
  const currentYear = new Date().getFullYear();
  return currentYear - releaseYear;
};

export default calculateMovieAge;
