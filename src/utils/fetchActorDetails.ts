import axios from "axios";

const apiKey = import.meta.env.VITE_TMDB_API_KEY;

interface ActorDetails {
  birthday: string | null;
  deathday: string | null;
  profile_path: string | null;
  name: string;
}

/**
 * Fetches detailed information about an actor, including their birthday, deathday, profile image, and name.
 *
 * @param actorId - The unique ID of the actor.
 * @returns An object containing the actor's birthday, deathday, profile image path, and name.
 */
const fetchActorDetails = async (actorId: number): Promise<ActorDetails> => {
  try {
    const response = await axios.get(
      `https://api.themoviedb.org/3/person/${actorId}?api_key=${apiKey}`
    );

    console.log("Actor Details Response:", response.data); // Log response for debugging

    return {
      birthday: response.data.birthday,
      deathday: response.data.deathday,
      profile_path: response.data.profile_path, // Added profile path
      name: response.data.name, // Added name
    };
  } catch (error) {
    console.error("Error fetching actor details:", error);
    return { birthday: null, deathday: null, profile_path: null, name: "" };
  }
};

export default fetchActorDetails;
