import axios from "axios";

const apiKey = import.meta.env.VITE_TMDB_API_KEY;

interface ActorDetails {
  birthday: string | null;
  deathday: string | null;
  profile_path: string | null;
  name: string;
}

// In-memory cache for actor details to avoid redundant API calls
const actorCache = new Map<number, ActorDetails>();

/**
 * Fetches detailed information about an actor, including their birthday, deathday, profile image, and name.
 * Results are cached in memory so repeat lookups (e.g. same actor across movies) skip the network.
 *
 * @param actorId - The unique ID of the actor.
 * @returns An object containing the actor's birthday, deathday, profile image path, and name.
 */
const fetchActorDetails = async (actorId: number): Promise<ActorDetails> => {
  const cached = actorCache.get(actorId);
  if (cached) return cached;

  try {
    const response = await axios.get(
      `https://api.themoviedb.org/3/person/${actorId}?api_key=${apiKey}`
    );

    const details: ActorDetails = {
      birthday: response.data.birthday,
      deathday: response.data.deathday,
      profile_path: response.data.profile_path,
      name: response.data.name,
    };

    actorCache.set(actorId, details);
    return details;
  } catch (error) {
    throw error;
  }
};

export default fetchActorDetails;
