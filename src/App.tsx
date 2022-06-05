import { onMount, createSignal, For, Show, createEffect, createResource, createMemo } from "solid-js";

import Navbar from "./components/Navbar";
import Card from "./components/Card";
import Select from "./components/Select";
import { theme, setTheme } from "./AppStore";
import { RestCountry } from "./CountriesInterface";
import styles from "./App.module.css";

const BASE_API_URL = "https://restcountries.com/v3.1/";
const DEFAULT_API_URL = BASE_API_URL + "all";

async function fetchData(url: string): Promise<RestCountry[]> {
  const res: Response = await fetch(url);
  return res.json();
}

const App = () => {
  const [textValue, setTextValue] = createSignal("");
  const [regionValue, setRegionValue] = createSignal("");
  const [apiUrl, setApiUrl] = createSignal(DEFAULT_API_URL);
  const [data] = createResource(apiUrl, fetchData);
  const [cardsVisible, setCardsVisible] = createSignal(12);
  const filteredData = createMemo(() => data()?.filter((e) => isVisible(e)));

  const observer = new IntersectionObserver(
    (entries, observer) => {
      if (entries[0].isIntersecting) {
        if (cardsVisible() === filteredData()!.length) {
          observer.disconnect();
          return;
        }
        setCardsVisible((prev) => (prev + 12 > filteredData()!.length ? filteredData()!.length : prev + 12));
        // get last card and start observing
        observeLastCard();
      }
    },
    { threshold: 1, rootMargin: "-15px" }
  );

  function observeLastCard() {
    // unobserve all
    observer.disconnect();
    // observe last
    let target = document.querySelector("div." + styles.container + " > div:last-child")!;
    // console.log(target);
    if (target) observer.observe(target);
  }

  // check if card must be visible
  function isVisible(country: RestCountry): boolean {
    let textMatch = country.name.common.toLowerCase().includes(textValue().toLowerCase());
    let regionMatch = true;
    if (regionValue() != "") regionMatch = country.region === regionValue();
    return textMatch && regionMatch;
  }

  //theme init
  onMount(() => {
    if (localStorage.getItem("theme") == "theme-light") setTheme("theme-light");
    else setTheme("theme-dark");
    localStorage.setItem("theme", theme());
    document.documentElement.className = theme();
  });

  // start observing after fetch completed
  // reset last observed card on every input change
  createEffect(() => {
    if (data()) {
      textValue();
      regionValue();
      setCardsVisible(12);
      observeLastCard();
    }
  });

  return (
    <>
      <Navbar />
      <header class={styles.container}>
        {/* Text input */}
        <label class={styles.headerInput}>
          <i class="fal fa-search fa-sm"></i>
          <input
            onKeyUp={(e: Event) => {
              setTextValue((e.target as HTMLInputElement).value);
            }}
            type="text"
            name="country-name"
            id="text-input"
            placeholder="Search for a country..."
          />
        </label>
        {/* Select input */}
        <Select
          inputValue={regionValue}
          setInputValue={setRegionValue}
          data={new Set(data()?.map((el) => el.region))}
        />
      </header>
      <div class={styles.container}>
        <For each={filteredData()?.slice(0, cardsVisible())} fallback={<h3>No country matches the search filters.</h3>}>
          {(country) => <Card data={country} />}
        </For>
      </div>
    </>
  );
};

export default App;
