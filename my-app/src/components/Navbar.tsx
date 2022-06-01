import type { Component } from "solid-js";

import styles from "./Navbar.module.css";
import { theme, toggleTheme } from "../AppStore";

const Navbar: Component = () => {
  return (
    <nav class={styles.nav}>
      <h1 class={styles.nav__title}>Where in the world?</h1>
      <ul
        class={styles.nav__list}
        onClick={() => {
          toggleTheme();
        }}
      >
        <li class={styles.nav__item}>
          <i class={(theme() == "theme-light" ? "far" : "fas") + " fa-moon fa-lg " + styles.nav__icon}></i>
        </li>
        <li class={styles.nav__item}>{theme() == "theme-light" ? "Light Mode" : "Dark Mode"}</li>
      </ul>
    </nav>
  );
};

export default Navbar;
