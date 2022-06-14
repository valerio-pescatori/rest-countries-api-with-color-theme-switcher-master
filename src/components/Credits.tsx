import { Component, createEffect, createMemo, createSignal, Show } from "solid-js";

import style from "./Credits.module.css";

const Credits: Component = () => {
  const [open, setOpen] = createSignal(false);

  let computedStyle = createMemo(() => style.credits + " " + (open() ? style.open : null));

  return (
    <div class={computedStyle()} onClick={() => setOpen(!open())}>
      <Show when={open()} fallback={<i class="far fa-question"></i>}>
        <span>
          Coded by{" "}
          <a href="https://github.com/valerio-pescatori" style="text-decoration: underline">
            Valerio Pescatori
          </a>
          <i class={"fal fa-xmark " + style.xmark}></i>
        </span>
      </Show>
    </div>
  );
};

export default Credits;
