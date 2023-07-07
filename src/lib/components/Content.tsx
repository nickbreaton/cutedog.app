import { JSX } from "solid-js";
import { css } from "~styled-system/css";

export function Content(props: { children: JSX.Element }) {
  return <div class={css({ maxW: "lg", m: "auto", paddingInline: "3" })}>{props.children}</div>;
}
