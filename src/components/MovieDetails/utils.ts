import { Actor } from "../../types/types";
import { ActorProps } from "../ActorCard/types";

export function mapActorToProps(actor: Actor): ActorProps {
  return {
    id: actor.id,
    name: actor.name,
    character: actor.character,
    profilePath: actor.profile_path || undefined,
    birthday: actor.birthday || undefined,
    deathday: actor.deathday || undefined,
    currentAge: actor.currentAge || undefined,
    ageAtDeath: actor.ageAtDeath || undefined,
    ageAtRelease: actor.ageAtRelease || undefined,
  };
}
