import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { Typography } from "./Typography";

const meta = {
  title: "Components/Typography",
  component: Typography,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Typography system showing all heading levels, paragraphs, and link styles.",
      },
    },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Typography>;

export default meta;
type Story = StoryObj<typeof Typography>;

export const TypeSystem: Story = {
  name: "All Typography Elements",
  render: () => (
    <div style={{ maxWidth: "800px", margin: "0 auto" }}>
      {/* Headings */}
      <section style={{ marginBottom: "2rem" }}>
        <h2 style={{ marginBottom: "1rem" }}>Headings</h2>
        <h1>Heading Level 1</h1>
        <h2>Heading Level 2</h2>
        <h3>Heading Level 3</h3>
        <h4>Heading Level 4</h4>
        <h5>Heading Level 5</h5>
        <h6>Heading Level 6</h6>
      </section>

      {/* Body Text */}
      <section style={{ marginBottom: "2rem" }}>
        <h2 style={{ marginBottom: "1rem" }}>Body Text</h2>
        <p className="lead">
          This is a lead paragraph. Use it for introducing sections or important
          content.
        </p>
        <p>
          This is a regular paragraph. It forms the basis of your content and
          should be clear and readable.
        </p>
        <p className="small">
          This is small text, useful for captions, footnotes, or secondary
          information.
        </p>
      </section>

      {/* Links */}
      <section style={{ marginBottom: "2rem" }}>
        <h2 style={{ marginBottom: "1rem" }}>Links</h2>
        <p>
          <a href="#">Regular Link</a>
        </p>
        <p>
          <a href="#" className="hover">
            Hover State
          </a>
        </p>
        <p>
          <a href="#" className="active">
            Active State
          </a>
        </p>
      </section>

      {/* Lists */}
      <section style={{ marginBottom: "2rem" }}>
        <h2 style={{ marginBottom: "1rem" }}>Lists</h2>
        <ul style={{ marginBottom: "1rem" }}>
          <li>Unordered list item one</li>
          <li>Unordered list item two</li>
          <li>Unordered list item three</li>
        </ul>
        <ol>
          <li>Ordered list item one</li>
          <li>Ordered list item two</li>
          <li>Ordered list item three</li>
        </ol>
      </section>

      {/* Quotes */}
      <section style={{ marginBottom: "2rem" }}>
        <h2 style={{ marginBottom: "1rem" }}>Quotes</h2>
        <blockquote>
          <p>
            "This is a blockquote. Use it for citing content from other
            sources."
          </p>
          <footer>— Quote Attribution</footer>
        </blockquote>
      </section>
    </div>
  ),
};
