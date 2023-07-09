import { JSX } from "solid-js";
import { css } from "~styled-system/css";
import { token } from "~styled-system/tokens";

export function Content(props: { children: JSX.Element }) {
  return (
    <div
      class={css({
        m: "auto",
        paddingInline: "4",
        sm: {
          paddingInline: "0",
          maxW: "lg",
        },
      })}
    >
      {props.children}
    </div>
  );
}
