import { Component, createEffect, createResource, For, onMount, Show } from "solid-js";
import styles from "./Country.module.css";
import { RestCountry } from "../CountriesInterface";
import { Link, useParams } from "solid-app-router";
import { BASE_API_URL, formatNumber } from "../index";

async function fetchCountry(id: string): Promise<RestCountry> {
  const res: Response = await fetch(BASE_API_URL + "alpha/" + id);
  let arr = await res.json();
  return arr[0];
}

async function getCountryNameByAlpha(alphaCodes: string[]): Promise<String[]> {
  let promises: Promise<RestCountry>[] = alphaCodes.map(async (alpha) => {
    let response: Response = await fetch(BASE_API_URL + "alpha/" + alpha);
    let country = await response.json();
    return country[0];
  });
  let responses: RestCountry[] = await Promise.all(promises);
  return responses.map((el) => el.name.common);
}

const Country: Component = (props) => {
  const params = useParams();
  const [country] = createResource(() => params.id, fetchCountry);
  const [borders] = createResource(() => country()?.borders?.slice(0, 3), getCountryNameByAlpha);

  return (
    <Show when={country()} fallback={<h1 style="text-align: center; margin-top: 2em">Loading...</h1>}>
      <header class={styles.container}>
        <Link href="/">
          <div class={styles.button}>
            <i class="fal fa-arrow-left"></i>
            Back
          </div>
        </Link>
      </header>
      <div class={styles.container}>
        {/* Image */}
        <img class={styles.cardImg} src={country()!.flags.png}></img>
        {/* Body */}
        <div class={styles.cardBody}>
          {/* Title */}
          <h1 class={styles.cardTitle}>{country()!.name.common}</h1>
          {/* Content */}
          <div class={styles.cardParagraphContainer}>
            <div class={styles.cardParagraph}>
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
            <div class={styles.cardParagraph}>
              <p>
                <span style="font-weight: bold">Top Level Domain: </span>
                {country()!.tld[0]}
              </p>
              <p>
                <span style="font-weight: bold">Currency: </span>
                {Object.values(country()!.currencies)[0].name}
              </p>
              <p>
                <span style="font-weight: bold">Languages: </span>

                <For each={Object.values(country()!.languages)} fallback={<span>Loading...</span>}>
                  {(el, i) => (i() == Object.values(country()!.languages).length - 1 ? el : el + ", ")}
                </For>
              </p>
            </div>
          </div>
          {/* Borders*/}
          <div class={styles.cardBorders}>
            <p style="font-weight: bold">Border Countries: </p>
            <div>
              <For each={borders()} fallback={<span> None</span>}>
                {(border) => <span class={styles.cardBorder}>{border + " "}</span>}
              </For>
            </div>
          </div>
        </div>
      </div>
    </Show>
  );
};

export default Country;
