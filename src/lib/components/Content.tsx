import { JSX } from "solid-js";

export function Content(props: { children: JSX.Element }) {
  return <div class="m-auto max-w-lg">{props.children}</div>;
}
