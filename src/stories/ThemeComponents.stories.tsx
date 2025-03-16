import type { Meta, StoryObj } from "@storybook/react";
import Select from "../components/Select/Select";
import SettingsMenu from "../components/SettingsMenu/SettingsMenu";
import "../styles/theme.css";

const meta = {
  title: "Theme/Components",
  parameters: {
    layout: "centered",
  },
  decorators: [
    (Story) => (
      <div style={{ padding: "2rem" }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const DemoRow = ({
  children,
  label,
}: {
  children: React.ReactNode;
  label: string;
}) => (
  <div style={{ marginBottom: "2rem" }}>
    <h3 style={{ marginBottom: "1rem" }}>{label}</h3>
    {children}
  </div>
);

export const LightMode: Story = {
  render: () => (
    <div>
      <DemoRow label="Select Variants">
        <div style={{ display: "flex", gap: "1rem" }}>
          <Select
            options={[
              { value: "1", label: "Default Select" },
              { value: "2", label: "Option 2" },
            ]}
            value="1"
            onChange={() => {}}
          />
          <Select
            options={[
              { value: "1", label: "Primary Select" },
              { value: "2", label: "Option 2" },
            ]}
            value="1"
            onChange={() => {}}
            variant="primary"
          />
        </div>
      </DemoRow>

      <DemoRow label="Settings Menu">
        <SettingsMenu
          options={[
            { id: "1", label: "Option 1", checked: true, onChange: () => {} },
            { id: "2", label: "Option 2", checked: false, onChange: () => {} },
          ]}
        />
      </DemoRow>
    </div>
  ),
};

export const DarkMode: Story = {
  ...LightMode,
  parameters: {
    themes: {
      themeOverride: "dark",
    },
  },
  decorators: [
    (Story) => (
      <div data-theme="dark" style={{ padding: "2rem", background: "#1a1a1a" }}>
        <Story />
      </div>
    ),
  ],
};

export const ColorBlindnessSimulation: Story = {
  render: () => (
    <div>
      <DemoRow label="Deuteranopia (Red-Green Color Blindness)">
        <div style={{ filter: "url(#deuteranopia)" }}>
          {/* Your components */}
        </div>
      </DemoRow>
      <DemoRow label="Protanopia">
        <div style={{ filter: "url(#protanopia)" }}>
          {/* Your components */}
        </div>
      </DemoRow>
      <DemoRow label="Tritanopia">
        <div style={{ filter: "url(#tritanopia)" }}>
          {/* Your components */}
        </div>
      </DemoRow>
    </div>
  ),
};
