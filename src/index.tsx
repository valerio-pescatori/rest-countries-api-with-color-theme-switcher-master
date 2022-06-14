/* @refresh reload */
import { render } from "solid-js/web";

import "./index.css";
import App from "./App";
import { Route, Router, Routes } from "solid-app-router";
const Country = lazy(() => import("./components/Country"));
import Navbar from "./components/Navbar";
import Credits from "./components/Credits";
import { lazy, onMount } from "solid-js";
import { theme, setTheme } from "./AppStore";

export const BASE_API_URL = "https://restcountries.com/v3.1/";
export const DEFAULT_API_URL = BASE_API_URL + "all";

export function formatNumber(number: number): string {
  let numStr: string[] = number.toString().split("");
  for (let i = numStr.length - 4; i >= 0; i -= 3) numStr.splice(i + 1, 0, ",");
  return numStr.join("");
}

//theme init
onMount(() => {
  if (localStorage.getItem("theme") == "theme-light") setTheme("theme-light");
  else setTheme("theme-dark");
  localStorage.setItem("theme", theme());
  document.documentElement.className = theme();
});

render(
  () => (
    <>
      <Navbar />

      <Router>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/country/:id" element={<Country />} />
        </Routes>
      </Router>

      <Credits />
    </>
  ),
  document.getElementById("root") as HTMLElement
);
