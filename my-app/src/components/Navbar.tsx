import type { Component } from "solid-js";
import { style } from "solid-js/web";

import styles from "./Navbar.module.css";

const Navbar: Component = () => {
  return (
    <nav class={styles.nav}>
      <h1 class={styles.nav__title}>Where in the world?</h1>
      <ul class={styles.nav__list}>
        <li class={styles.nav__item}>
          <i class="fal fa-mooon"></i>
        </li>
        <li class={styles.nav__item}>Dark mode</li>
      </ul>
    </nav>
  );
};

export default Navbar;
