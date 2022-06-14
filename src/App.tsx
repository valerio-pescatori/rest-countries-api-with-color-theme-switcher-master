import { onMount, createSignal, For, createEffect, createResource, createMemo, onCleanup } from "solid-js";
import { Link } from "solid-app-router";

import Card from "./components/Card";
import Select from "./components/Select";
import { RestCountry } from "./CountriesInterface";
import styles from "./App.module.css";
import { DEFAULT_API_URL } from "./index";

async function fetchData(): Promise<RestCountry[]> {
  const res: Response = await fetch(DEFAULT_API_URL);
  return res.json();
}

const App = () => {
  const [textValue, setTextValue] = createSignal("");
  const [regionValue, setRegionValue] = createSignal("");
  const [data] = createResource(fetchData);
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
        observeElement(cardsVisible());
      }
    },
    { threshold: 1 }
  );

  onCleanup(() => observer.disconnect());

  function observeElement(targetIndex: number) {
    // unobserve all
    observer.disconnect();
    // observe last
    let target = document.querySelector("div." + styles.container + " > a:nth-child(" + targetIndex + ")")!;
    if (target) observer.observe(target);
  }

  // start observing after fetch completed
  // reset last observed card on every input change
  createEffect(() => {
    if (data()) {
      textValue();
      regionValue();
      setCardsVisible(12);
      // POSSIBLE SOLUTION: PASS THE INDEX OF THE LAST CARD MANUALLY
      observeElement(12);
    }
  });

  // check if card must be visible
  function isVisible(country: RestCountry): boolean {
    let textMatch = country.name.common.toLowerCase().includes(textValue().toLowerCase());
    let regionMatch = true;
    if (regionValue() != "") regionMatch = country.region === regionValue();
    return textMatch && regionMatch;
  }

  return (
    <>
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
          {(country) => (
            <Link href={"/country/" + country.cca2}>
              <Card data={country} />
            </Link>
          )}
        </For>
      </div>
    </>
  );
};

export default App;
