import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./ActorCard.module.css";
import { ActorCardProps } from "./types";
import { ActorImage } from "./components/ActorImage";
import { ActorHeader } from "./components/ActorHeader";
import { ActorMetrics } from "./components/ActorMetrics";
import classNames from "classnames";

const ActorCard: React.FC<ActorCardProps> = ({
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
    console.log("Card clicked, navigating to:", `/actor/${actor.id}`);
    navigate(`/actor/${actor.id}`);
  };

  return (
    <div className={styles.actorCardLink} onClick={handleCardClick}>
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
};

export default ActorCard;
