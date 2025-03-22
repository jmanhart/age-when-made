export type ActorCardVariant =
  | "default"
  | "compact"
  | "detailed"
  | "grid"
  | "list";

export interface ActorMetadata {
  ages: {
    current?: number;
    atDeath?: number;
    atRelease?: number;
  };
  dates: {
    birth?: string;
    death?: string;
    movieRelease?: string;
  };
  roles: {
    character: string;
    // other role-related info
  };
}

export interface ActorProps {
  id: number;
  name: string;
  character: string;
  profilePath?: string;
  birthday?: string;
  deathday?: string;
  currentAge?: number;
  ageAtDeath?: number;
  ageAtRelease?: number;
}

export interface ActorCardProps {
  variant?: ActorCardVariant;
  orientation?: "vertical" | "horizontal";
  showMetrics?: boolean;
  showImage?: boolean;
  imageSize?: "small" | "medium" | "large";
  actor: ActorProps;
  className?: string;
}
