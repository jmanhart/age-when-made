import type { Meta, StoryObj } from "@storybook/react";
import { MemoryRouter } from "react-router-dom";
import ActorCard from "./ActorCard";
import { mockActors } from "../../__mocks__/movieData";
import "./ActorCard.module.css";

const meta = {
  title: "Components/ActorCard",
  component: ActorCard,
  decorators: [
    (Story) => (
      <MemoryRouter>
        <Story />
      </MemoryRouter>
    ),
  ],
} satisfies Meta<typeof ActorCard>;

export default meta;
type Story = StoryObj<typeof meta>;

// Convert mock actor to ActorCard props format
const convertActorToProps = (mockActor: (typeof mockActors)[0]) => ({
  id: mockActor.id,
  name: mockActor.name,
  character: "as Self", // Default character name
  profilePath: mockActor.profile_path || undefined,
  birthday: mockActor.birthday || undefined,
  deathday: mockActor.deathday || undefined,
  currentAge: mockActor.currentAge || undefined,
  ageAtDeath: mockActor.ageAtDeath || undefined,
  ageAtRelease: mockActor.ageAtRelease || undefined,
});

export const LeonardoDiCaprio: Story = {
  args: {
    actor: {
      ...convertActorToProps(mockActors[0]),
      character: "Dom Cobb", // From Inception
    },
  },
};

export const ChristianBale: Story = {
  args: {
    actor: {
      ...convertActorToProps(mockActors[1]),
      character: "Bruce Wayne / Batman", // From The Dark Knight
    },
  },
};

export const CillianMurphy: Story = {
  args: {
    actor: {
      ...convertActorToProps(mockActors[5]),
      character: "J. Robert Oppenheimer", // From Oppenheimer
    },
  },
};

export const UmaThurman: Story = {
  args: {
    actor: {
      ...convertActorToProps(mockActors[4]),
      character: "The Bride", // From Kill Bill
    },
  },
};

export const NoImage: Story = {
  args: {
    actor: {
      ...convertActorToProps(mockActors[0]),
      profilePath: "",
    },
  },
};

// Example of a deceased actor (fictional for demonstration)
export const Deceased: Story = {
  args: {
    actor: {
      ...convertActorToProps(mockActors[0]),
      deathday: "2022-05-01",
      ageAtDeath: 47,
      currentAge: undefined,
    },
  },
};
