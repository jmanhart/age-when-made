/**
 * Utility functions for creating URL-friendly slugs from movie titles and actor names
 * and parsing them back to extract IDs.
 */

/**
 * Creates a URL-friendly slug from a string (movie title or actor name)
 * @param text - The text to convert to a slug
 * @param year - Optional year for disambiguation (movies only)
 * @param id - The ID (optional, for backward compatibility)
 * @returns A URL-friendly slug
 */
export const createSlug = (
  text: string,
  year?: number,
  id?: number
): string => {
  const baseSlug = text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "") // Remove special characters except spaces and hyphens
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/-+/g, "-") // Replace multiple hyphens with single hyphen
    .replace(/^-|-$/g, ""); // Remove leading/trailing hyphens

  // Add year for disambiguation if provided
  if (year) {
    return `${baseSlug}-${year}`;
  }

  // Only append ID if provided (for backward compatibility)
  return id ? `${baseSlug}-${id}` : baseSlug;
};

/**
 * Extracts the ID from a slug
 * @param slug - The slug containing the ID
 * @returns The extracted ID or null if not found
 */
export const extractIdFromSlug = (slug: string): number | null => {
  const match = slug.match(/-(\d+)$/);
  return match ? parseInt(match[1], 10) : null;
};

/**
 * Creates a movie URL slug with year disambiguation
 * @param title - The movie title
 * @param releaseDate - The movie release date (YYYY-MM-DD format)
 * @returns A URL-friendly movie slug with year
 */
export const createMovieSlug = (
  title: string,
  releaseDate?: string
): string => {
  const year = releaseDate ? new Date(releaseDate).getFullYear() : undefined;
  return createSlug(title, year);
};

/**
 * Creates an actor URL slug (without ID for cleaner URLs)
 * @param name - The actor name
 * @returns A URL-friendly actor slug
 */
export const createActorSlug = (name: string): string => {
  return createSlug(name);
};

/**
 * Parses a movie slug to extract the movie title and year
 * @param movieSlug - The movie slug from the URL
 * @returns Object with title and optional year, or null if not found
 */
export const parseMovieSlug = (
  movieSlug: string
): { title: string; year?: number } | null => {
  if (!movieSlug) return null;

  // Check if slug ends with a 4-digit year
  const yearMatch = movieSlug.match(/^(.+)-(\d{4})$/);

  if (yearMatch) {
    return {
      title: yearMatch[1].replace(/-/g, " "),
      year: parseInt(yearMatch[2], 10),
    };
  }

  // No year found, return just the title
  return {
    title: movieSlug.replace(/-/g, " "),
  };
};

/**
 * Parses an actor slug to extract the actor name
 * @param actorSlug - The actor slug from the URL
 * @returns The actor name or null if not found
 */
export const parseActorSlug = (actorSlug: string): string | null => {
  // For clean URLs without ID, we return the slug as the name
  // The components will need to look up the actor by name
  return actorSlug || null;
};

/**
 * Checks if a string is a numeric ID (for backward compatibility)
 * @param value - The value to check
 * @returns True if the value is a numeric ID
 */
export const isNumericId = (value: string): boolean => {
  return /^\d+$/.test(value);
};

/**
 * Parses a movie identifier and returns either the ID or title/year
 * @param identifier - Either a numeric ID string or a movie slug
 * @returns Object with either id or title/year, or null if not found
 */
export const parseMovieIdentifier = (
  identifier: string
): { id?: number; title?: string; year?: number } | null => {
  if (isNumericId(identifier)) {
    return { id: parseInt(identifier, 10) };
  }
  const parsed = parseMovieSlug(identifier);
  return parsed ? { title: parsed.title, year: parsed.year } : null;
};

/**
 * Parses an actor identifier and returns either the ID or name
 * @param identifier - Either a numeric ID string or an actor slug
 * @returns Object with either id or name, or null if not found
 */
export const parseActorIdentifier = (
  identifier: string
): { id?: number; name?: string } | null => {
  if (isNumericId(identifier)) {
    return { id: parseInt(identifier, 10) };
  }
  const name = parseActorSlug(identifier);
  return name ? { name } : null;
};
