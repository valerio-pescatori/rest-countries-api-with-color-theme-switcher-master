import { Component } from "solid-js";
import styles from "./Card.module.css";
import { RestCountry } from "../CountriesInterface";

function format(number: number): string {
  let numStr: string[] = number.toString().split("");
  for (let i = numStr.length - 4; i >= 0; i -= 3) numStr.splice(i + 1, 0, ",");
  return numStr.join("");
}

const Card: Component<{ data: RestCountry; show: boolean }> = (props) => {
  let country = props.data;

  return (
    <>
      <div class={styles.card__wrapper} style={props.show ? "" : "display: none"}>
        <div class={styles.card}>
          <img class={styles.card__img} src={country.flags.png} alt="Card image" />
          <div class={styles.card__body}>
            <h3 class={styles.card__title}>{country.name.common}</h3>
            <div>
              <span class={styles.card__item}>Population:</span> {format(country.population)}
            </div>
            <div>
              <span class={styles.card__item}>Region:</span> {country.region}
            </div>
            <div>
              <span class={styles.card__item}>Capital:</span> {country.capital ? country.capital[0] : "N/D"}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Card;
