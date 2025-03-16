import type { Meta, StoryObj } from "@storybook/react";
import Select from "./Select";

const meta = {
  title: "Components/Select",
  component: Select,
  argTypes: {
    onChange: { action: "changed" },
  },
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

export const StatusFilter: Story = {
  args: {
    value: "All",
    options: [
      { value: "All", label: "All" },
      { value: "Alive", label: "Alive" },
      { value: "Deceased", label: "Deceased" },
    ],
    className: "statusFilter",
  },
};

export const SortOrder: Story = {
  args: {
    value: "none",
    options: [
      { value: "none", label: "No Sort" },
      { value: "oldest", label: "Oldest" },
      { value: "youngest", label: "Youngest" },
    ],
    className: "sortOrder",
  },
};

export const Primary: Story = {
  args: {
    value: "All",
    options: [
      { value: "All", label: "All" },
      { value: "Alive", label: "Alive" },
      { value: "Deceased", label: "Deceased" },
    ],
    variant: "primary",
  },
};

export const Small: Story = {
  args: {
    value: "All",
    options: [
      { value: "All", label: "All" },
      { value: "Alive", label: "Alive" },
      { value: "Deceased", label: "Deceased" },
    ],
    size: "small",
  },
};

export const Large: Story = {
  args: {
    value: "All",
    options: [
      { value: "All", label: "All" },
      { value: "Alive", label: "Alive" },
      { value: "Deceased", label: "Deceased" },
    ],
    size: "large",
  },
};
