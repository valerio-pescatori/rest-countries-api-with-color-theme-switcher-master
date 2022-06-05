import { onMount, createSignal, For, createEffect, createResource } from "solid-js";

import Navbar from "./components/Navbar";
import Card from "./components/Card";
import Select from "./components/Select";
import { theme, setTheme } from "./AppStore";
import { RestCountry } from "./CountriesInterface";
import styles from "./App.module.css";

const BASE_API_URL = "https://restcountries.com/v3.1/";
const DEFAULT_API_URL = BASE_API_URL + "all";

const App = () => {
  const [textValue, setTextValue] = createSignal("");
  const [regionValue, setRegionValue] = createSignal("");
  const [apiUrl, setApiUrl] = createSignal(DEFAULT_API_URL);
  const [data, { mutate, refetch }] = createResource(apiUrl, fetchData);
  const [cardsVisible, setCardsVisible] = createSignal(12);

  const observer = new IntersectionObserver(
    (entries, observer) => {
      if (entries[0].isIntersecting) {
        // unobserver last card
        let target = document.querySelector("div." + styles.container + " > div:last-child")!;
        observer.unobserve(target);
        setCardsVisible((prev) => prev + 12);
        // get last card and start observing
        target = document.querySelector("div." + styles.container + " > div:last-child")!;
        observer.observe(target);
      }
    },
    { threshold: 1, rootMargin: "-15px" }
  );

  async function fetchData(url: string): Promise<RestCountry[]> {
    const res: Response = await fetch(url);
    console.log(data());
    return res.json();
  }

  onMount(() => {
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

  // start observing after fetch completed
  createEffect(() => {
    if (data()) {
      //get last card
      let target = document.querySelector("div." + styles.container + " > div:last-child")!;
      observer.observe(target);
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
              (e.target as HTMLInputElement).value === ""
                ? setApiUrl(DEFAULT_API_URL)
                : setApiUrl(BASE_API_URL + "name/" + (e.target as HTMLInputElement).value);
              // setTextValue((e.target as HTMLInputElement).value);
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
        <For each={data()?.slice(0, cardsVisible())}>
          {(country, i) =>
            i() == cardsVisible() - 1 ? (
              <Card data={country} show={isVisible(country)} />
            ) : (
              <Card data={country} show={isVisible(country)} />
            )
          }
        </For>
      </div>
    </>
  );
};

export default App;
