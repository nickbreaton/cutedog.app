import { JSX } from "solid-js";

export function Content(props: { children: JSX.Element }) {
  return <div class="sm:m-auto sm:max-w-lg">{props.children}</div>;
}
