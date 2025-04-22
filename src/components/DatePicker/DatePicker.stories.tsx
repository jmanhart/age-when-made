import type { Meta, StoryObj } from "@storybook/react";
import DatePicker from "./DatePicker";

const meta = {
  title: "Components/DatePicker",
  component: DatePicker,
  argTypes: {
    onChange: { action: "changed" },
    minAge: {
      control: { type: "number", min: 0, max: 120 },
      description: "Minimum allowed age",
    },
    maxAge: {
      control: { type: "number", min: 0, max: 120 },
      description: "Maximum allowed age",
    },
    placeholder: {
      control: "text",
      description: "Placeholder text for the input",
    },
  },
} satisfies Meta<typeof DatePicker>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    value: null,
    onChange: (date) => console.log("Date changed:", date),
    minAge: 0,
    maxAge: 120,
    placeholder: "Select birth date",
  },
};

export const WithInitialValue: Story = {
  args: {
    value: "1990-01-01",
    onChange: (date) => console.log("Date changed:", date),
    minAge: 0,
    maxAge: 120,
    placeholder: "Select birth date",
  },
};

export const RestrictedAgeRange: Story = {
  args: {
    value: null,
    onChange: (date) => console.log("Date changed:", date),
    minAge: 18,
    maxAge: 100,
    placeholder: "Select birth date (18-100 years)",
  },
};

export const CustomPlaceholder: Story = {
  args: {
    value: null,
    onChange: (date) => console.log("Date changed:", date),
    minAge: 0,
    maxAge: 120,
    placeholder: "When were you born?",
  },
};
