import { createSignal } from "solid-js";

const [theme, setTheme] = createSignal("theme-dark");
const toggleTheme = () => {
  theme() === "theme-light" ? setTheme("theme-dark") : setTheme("theme-light");
  localStorage.setItem("theme", theme());
  document.documentElement.className = theme();
};

export { theme, setTheme, toggleTheme };
