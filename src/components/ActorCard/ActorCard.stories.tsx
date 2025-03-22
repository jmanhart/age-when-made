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
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "compact", "detailed", "grid", "list"],
      description: "The visual style variant of the card",
    },
    orientation: {
      control: "radio",
      options: ["vertical", "horizontal"],
      description: "The layout orientation of the card",
    },
    showMetrics: {
      control: "boolean",
      description: "Whether to show the metrics section",
    },
    showImage: {
      control: "boolean",
      description: "Whether to show the actor image",
    },
    imageSize: {
      control: "select",
      options: ["small", "medium", "large"],
      description: "The size of the actor image",
    },
  },
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

const sampleActor = {
  id: 1,
  name: "Morgan Freeman",
  character: "Red",
  profilePath: "/poQNt8IlCJL3D3KQj8Aq3AWr7qP.jpg",
  birthday: "1937-06-01",
  currentAge: 86,
  ageAtRelease: 57,
};

const deceasedActor = {
  id: 2,
  name: "Paul Newman",
  character: "Luke",
  profilePath: "/8vgj3i8ypYjSFnGXWpxuESEOhJ5.jpg",
  birthday: "1925-01-26",
  deathday: "2008-09-26",
  ageAtDeath: 83,
  ageAtRelease: 42,
};

const noImageActor = {
  id: 3,
  name: "John Doe",
  character: "Extra",
  birthday: "1960-01-01",
  currentAge: 64,
  ageAtRelease: 35,
};

// Default Story
export const Default: Story = {
  args: {
    actor: sampleActor,
  },
};

// Variants
export const Compact: Story = {
  args: {
    actor: sampleActor,
    variant: "compact",
  },
};

export const Detailed: Story = {
  args: {
    actor: sampleActor,
    variant: "detailed",
    imageSize: "large",
  },
};

export const Grid: Story = {
  args: {
    actor: sampleActor,
    variant: "grid",
  },
};

export const List: Story = {
  args: {
    actor: sampleActor,
    variant: "list",
    orientation: "horizontal",
    imageSize: "small",
  },
};

// Orientations
export const Horizontal: Story = {
  args: {
    actor: sampleActor,
    orientation: "horizontal",
    imageSize: "small",
  },
};

// Special Cases
export const DeceasedActor: Story = {
  args: {
    actor: deceasedActor,
  },
};

export const NoMetrics: Story = {
  args: {
    actor: sampleActor,
    showMetrics: false,
  },
};

// Image Sizes
export const SmallImage: Story = {
  args: {
    actor: sampleActor,
    imageSize: "small",
  },
};

export const LargeImage: Story = {
  args: {
    actor: sampleActor,
    imageSize: "large",
  },
};

// Multiple Cards Grid Display
export const GridDisplay: Story = {
  args: {
    actor: sampleActor,
    variant: "grid",
  },
  decorators: [
    (Story) => (
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
          gap: "1rem",
          maxWidth: "1200px",
          padding: "1rem",
        }}
      >
        <Story args={{ actor: sampleActor, variant: "grid" }} />
        <Story args={{ actor: deceasedActor, variant: "grid" }} />
        <Story args={{ actor: noImageActor, variant: "grid" }} />
        <Story args={{ actor: { ...sampleActor, id: 4 }, variant: "grid" }} />
      </div>
    ),
  ],
};
