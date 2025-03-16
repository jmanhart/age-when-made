import type { Meta, StoryObj } from "@storybook/react";
import SettingsMenu from "./SettingsMenu";

const meta = {
  title: "Components/SettingsMenu",
  component: SettingsMenu,
} satisfies Meta<typeof SettingsMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    options: [
      {
        id: "hideNoImage",
        label: "Hide Actors Without Images",
        checked: true,
        onChange: () => {},
      },
      {
        id: "hideNoBirthDate",
        label: "Hide Actors Without Birth Dates",
        checked: false,
        onChange: () => {},
      },
    ],
  },
};
