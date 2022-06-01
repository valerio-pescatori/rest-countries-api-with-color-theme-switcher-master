import { onMount, createSignal, For } from "solid-js";

import Navbar from "./components/Navbar";
import Card from "./components/Card";
import { theme, setTheme } from "./AppStore";
import styles from "./App.module.css";

const App = () => {
  const [data, setData] = createSignal([]);
  const [textValue, setTextValue] = createSignal("");

  onMount(async () => {
    const res = await fetch("https://restcountries.com/v3.1/alpha?codes=ger,usa,bra,isl,afg,ala,alb,alg");
    setData(await res.json());

    if (localStorage.getItem("theme") == "theme-light") setTheme("theme-light");
    else setTheme("theme-dark");
    localStorage.setItem("theme", theme());
    document.documentElement.className = theme();
  });

  return (
    <>
      <Navbar />
      <header class={styles.container}>
        <div class={styles.headerInput}>
          <label for="text-input">
            <i class="fal fa-search fa-sm"></i>
          </label>
          <input
            onKeyUp={(e: Event) => setTextValue((e.target as HTMLInputElement).value)}
            type="text"
            name="country-name"
            id="text-input"
            placeholder="Search for a country..."
          />
        </div>
        <div class={styles.headerInput}>right</div>
      </header>
      <div class={styles.container}>
        <For each={data()}>
          {(country, i) => (
            <Card
              data={country}
              show={(country as any).name.common.toLowerCase().includes(textValue().toLowerCase())}
            />
          )}
        </For>
      </div>
    </>
  );
};

export default App;
