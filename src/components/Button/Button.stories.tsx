import Button from "./Button";

export default {
  title: "Components/Button",
  component: Button,
  argTypes: {
    variant: {
      control: { type: "radio" },
      options: ["primary", "secondary"],
    },
  },
};

export const Primary = () => <Button variant="primary">Primary Button</Button>;
export const Secondary = () => (
  <Button variant="secondary">Secondary Button</Button>
);
export const Clickable = () => (
  <Button variant="primary" onClick={() => alert("Button clicked!")}>
    Click Me
  </Button>
);
