import { MemoryRouter } from "react-router-dom"; // ✅ Import MemoryRouter
import ActorCard from "./ActorCard";
import "./ActorCard.module.css";

export default {
  title: "Components/ActorCard",
  component: ActorCard,
  decorators: [
    (Story) => (
      <MemoryRouter>
        <Story />
      </MemoryRouter>
    ),
  ],
};

const mockActor = {
  id: 1,
  name: "Leonardo DiCaprio",
  character: "Dom Cobb",
  profilePath: "https://via.placeholder.com/150", // ✅ Testing a guaranteed working image
  birthday: "1974-11-11",
  deathday: null,
  currentAge: 49,
  ageAtDeath: null,
  ageAtRelease: 36,
};

export const Default = () => <ActorCard actor={mockActor} />;
export const NoImage = () => (
  <ActorCard actor={{ ...mockActor, profilePath: "" }} />
);
export const Deceased = () => (
  <ActorCard
    actor={{
      ...mockActor,
      deathday: "2022-05-01",
      ageAtDeath: 47,
    }}
  />
);
