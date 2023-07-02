import { createRouteData } from "solid-start";

export function routeData() {
  return createRouteData(() => {
    console.log("asd");
  });
}

export default function Home() {
  return <main>Hello</main>;
}
