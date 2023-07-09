import { JSX } from "solid-js";
import { css } from "~styled-system/css";

export function Card(props: { children: JSX.Element }) {
  return (
    <article
      class={css({
        bg: "white",
        borderColor: "neutral.200",
        borderTopWidth: "thin",
        borderBottomWidth: "thin",
        p: "4",
        cursor: "default",
        sm: {
          borderWidth: "thin",
          borderRadius: "md",
        },
      })}
    >
      {props.children}
    </article>
  );
}
