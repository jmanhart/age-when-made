import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./ActorCard.module.css";
import { ActorCardProps } from "./types";
import { ActorImage } from "./components/ActorImage";
import { ActorHeader } from "./components/ActorHeader";
import { ActorMetrics } from "./components/ActorMetrics";
import classNames from "classnames";
import { createActorSlug } from "../../utils/slugUtils";

const ActorCard: React.FC<ActorCardProps> = React.memo(({
  actor,
  variant = "default",
  orientation = "vertical",
  showMetrics = true,
  showImage = true,
  imageSize = "medium",
  className,
}) => {
  const navigate = useNavigate();

  const cardClasses = classNames(
    styles.castItem,
    {
      [styles[`castItem--${variant}`]]: variant !== "default",
      [styles[`castItem--${orientation}`]]: orientation !== "vertical",
    },
    className
  );

  const handleCardClick = () => {
    const actorSlug = createActorSlug(actor.name);
    navigate(`/actor/${actorSlug}`);
  };

  return (
    <div
      className={styles.actorCardLink}
      onClick={handleCardClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleCardClick();
        }
      }}
      role="link"
      tabIndex={0}
      aria-label={`View ${actor.name}'s filmography`}
    >
      <div className={cardClasses}>
        {showImage && <ActorImage actor={actor} size={imageSize} />}
        <div className={styles.actorDetails}>
          <ActorHeader actor={actor} />
          {showMetrics && (
            <ActorMetrics
              actor={actor}
              variant={variant === "detailed" ? "detailed" : "compact"}
            />
          )}
        </div>
      </div>
    </div>
  );
});

ActorCard.displayName = "ActorCard";

export default ActorCard;
