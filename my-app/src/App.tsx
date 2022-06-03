import { onMount, createSignal, For, createEffect } from "solid-js";

import Navbar from "./components/Navbar";
import Card from "./components/Card";
import Select from "./components/Select";
import { theme, setTheme } from "./AppStore";
import styles from "./App.module.css";
import { RestCountry } from "./CountriesInterface";

const App = () => {
  const [data, setData] = createSignal<RestCountry[]>([]);
  const [textValue, setTextValue] = createSignal("");
  const [regionValue, setRegionValue] = createSignal("");

  onMount(async () => {
    const res = await fetch("https://restcountries.com/v3.1/alpha?codes=ger,usa,bra,isl,afg,ala,alb,alg");
    setData(await res.json());

    //theme init
    if (localStorage.getItem("theme") == "theme-light") setTheme("theme-light");
    else setTheme("theme-dark");
    localStorage.setItem("theme", theme());
    document.documentElement.className = theme();
  });

  function isVisible(country: RestCountry): boolean {
    let textMatch = country.name.common.toLowerCase().includes(textValue().toLowerCase());
    let regionMatch = true;
    if (regionValue() != "") regionMatch = country.region === regionValue();
    return textMatch && regionMatch;
  }

  return (
    <>
      <Navbar />
      <header class={styles.container}>
        {/* Text input */}
        <label class={styles.headerInput}>
          <i class="fal fa-search fa-sm"></i>
          <input
            onKeyUp={(e: Event) => setTextValue((e.target as HTMLInputElement).value)}
            type="text"
            name="country-name"
            id="text-input"
            placeholder="Search for a country..."
          />
        </label>
        {/* Select input */}
        <Select inputValue={regionValue} setInputValue={setRegionValue} data={new Set(data().map((el) => el.region))} />
      </header>
      <div class={styles.container}>
        <For each={data()}>{(country, i) => <Card data={country} show={isVisible(country)} />}</For>
      </div>
    </>
  );
};

export default App;
