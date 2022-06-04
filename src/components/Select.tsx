import { createSignal, Show, For, Component, Accessor, Setter } from "solid-js";
import headerStyle from "../App.module.css";
import styles from "./Select.module.css";

const Select: Component<{ inputValue: Accessor<string>; setInputValue: Setter<string>; data: Set<string> }> = (
  props
) => {
  const [selectVisible, setSelectVisible] = createSignal(false);

  function handleClick(e: Event) {
    // inserisci testo nella ref
    props.setInputValue((e.target as HTMLElement).innerText);
    setSelectVisible(false);
  }

  function handleFocusOut(e: Event) {
    e.stopPropagation();
    requestAnimationFrame(() => {
      if (!(e.currentTarget as Node).contains(document.activeElement)) setSelectVisible(false);
    });
  }

  return (
    <div
      onFocusIn={(e: Event) => {
        setSelectVisible(true);
      }}
      onFocusOut={handleFocusOut}
      class={headerStyle.headerInput}
      tabIndex="0"
    >
      <div class={styles.selectPlaceholder}>
        <span>{props.inputValue() === "" ? "Filter by region" : props.inputValue()}</span>
        <i
          class={"fal fa-" + (props.inputValue() === "" ? "chevron-down" : "xmark")}
          style="display: flex; align-items:center"
          // Reset solo se c'è la crocetta
          onFocusIn={(e) => {
            if (props.inputValue() != "") {
              // Reset value
              props.setInputValue("");
              // Stop bubbling
              e.stopPropagation();
              // blur to avoid focus bug
              (e.target as HTMLElement).blur();
            }
          }}
          tabindex="0"
        ></i>
      </div>
      <Show when={selectVisible()}>
        <div class={styles.select} tabIndex="0">
          <For each={Array.from(props.data)}>
            {(el) => (
              <span onClick={handleClick} class={styles.option}>
                {el}
              </span>
            )}
          </For>
        </div>
      </Show>
    </div>
  );
};

export default Select;
