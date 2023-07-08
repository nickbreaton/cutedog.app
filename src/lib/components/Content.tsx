import { JSX } from "solid-js";
import { css } from "~styled-system/css";
import { token } from "~styled-system/tokens";

export function Content(props: { children: JSX.Element }) {
  return (
    <div
      class={css({
        m: "auto",
        sm: {
          maxW: "lg",
        },
      })}
    >
      {props.children}
    </div>
  );
}
