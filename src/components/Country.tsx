import { Component, createResource, For, Show } from "solid-js";
import styles from "./Country.module.css";
import containerStyles from "../App.module.css";
import { RestCountry } from "../CountriesInterface";
import { useParams } from "solid-app-router";
import { BASE_API_URL, formatNumber } from "../index";

async function fetchCountry(id: string): Promise<RestCountry> {
  const res: Response = await fetch(BASE_API_URL + "alpha/" + id);
  let arr = await res.json();
  return arr[0];
}

const Country: Component = (props) => {
  const params = useParams();
  const [country] = createResource(() => params.id, fetchCountry);

  return (
    <Show when={country()} fallback={<h1 style="text-align: center; margin-top: 2em">Loading...</h1>}>
      <header class={containerStyles.container}>
        <div class={styles.button}>
          <i class="fal fa-arrow-left"></i>
          Back
        </div>
      </header>
      <div class={containerStyles.container} style="justify-content: start">
        <img class={styles.cardImg} src={country()!.flags.png}></img>
        <div class={styles.cardBody}>
          <h1 class={styles.cardTitle}>{country()!.name.common}</h1>
          <div class={styles.cardParagraphContainer}>
            <p class={styles.cardParagraph}>
              <span style="font-weight: bold">Native Name: </span>
              {Object.values(country()!.name.nativeName)[0].common}
            </p>
            <p class={styles.cardParagraph}>
              <span style="font-weight: bold">Population: </span>
              {formatNumber(country()!.population)}
            </p>
            <p class={styles.cardParagraph}>
              <span style="font-weight: bold">Region: </span>
              {country()!.region}
            </p>
            <p class={styles.cardParagraph}>
              <span style="font-weight: bold">Sub Region: </span>
              {country()!.subregion}
            </p>
            <p class={styles.cardParagraph}>
              <span style="font-weight: bold">Capital: </span>
              {country()!.capital}
            </p>
          </div>
          <div class={styles.cardParagraphContainer}>
            <p class={styles.cardParagraph}>
              <span style="font-weight: bold">Top Level Domain: </span>
              {country()!.tld[0]}
            </p>
            <p class={styles.cardParagraph}>
              <span style="font-weight: bold">Currency: </span>
              {Object.values(country()!.currencies)[0].name}
            </p>
            <p class={styles.cardParagraph}>
              <span style="font-weight: bold">Languages: </span>
              <For each={Object.values(country()!.languages)}>
                {(el, i) => (i() == Object.values(country()!.languages).length - 1 ? el : el + ", ")}
              </For>
            </p>
          </div>
        </div>
      </div>
    </Show>
  );
};

export default Country;
