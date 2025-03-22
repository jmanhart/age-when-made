import React from "react";
import styles from "./Typography.module.css";

export const Typography = () => {
  return (
    <div className={styles.typography}>
      <h1>Heading 1 - The quick brown fox jumps over the lazy dog</h1>
      <h2>Heading 2 - The quick brown fox jumps over the lazy dog</h2>
      <h3>Heading 3 - The quick brown fox jumps over the lazy dog</h3>
      <h4>Heading 4 - The quick brown fox jumps over the lazy dog</h4>
      <h5>Heading 5 - The quick brown fox jumps over the lazy dog</h5>
      <h6>Heading 6 - The quick brown fox jumps over the lazy dog</h6>

      <div className={styles.paragraphs}>
        <p className={styles.lead}>
          Lead paragraph - Lorem ipsum dolor sit amet, consectetur adipiscing
          elit. Sed do eiusmod tempor incididunt ut labore et dolore magna
          aliqua.
        </p>
        <p>
          Regular paragraph - Lorem ipsum dolor sit amet, consectetur adipiscing
          elit. Sed do eiusmod tempor incididunt ut labore et dolore magna
          aliqua.
        </p>
        <p className={styles.small}>
          Small paragraph - Lorem ipsum dolor sit amet, consectetur adipiscing
          elit. Sed do eiusmod tempor incididunt ut labore et dolore magna
          aliqua.
        </p>
      </div>

      <div className={styles.links}>
        <h3>Links</h3>
        <p>
          <a href="#">Regular link</a> - Lorem ipsum dolor sit amet, consectetur
          adipiscing elit.
        </p>
        <p>
          <a href="#" className={styles.linkHover}>
            Hover link
          </a>{" "}
          - Lorem ipsum dolor sit amet, consectetur adipiscing elit.
        </p>
        <p>
          <a href="#" className={styles.linkActive}>
            Active link
          </a>{" "}
          - Lorem ipsum dolor sit amet, consectetur adipiscing elit.
        </p>
      </div>
    </div>
  );
};
