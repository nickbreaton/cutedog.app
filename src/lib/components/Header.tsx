import { Content } from "./Content";
import { createEffect, createSignal, onCleanup } from "solid-js";
import { A } from "solid-start";

export function Header() {
  const [hasScrolled, setScrolled] = createSignal(false);

  createEffect(() => {
    const indicator = document.createElement("div");
    indicator.style.position = "absolute";
    indicator.style.left = "0";
    indicator.style.top = "0";
    indicator.style.width = "1px";
    indicator.style.height = "1px";
    document.body.append(indicator);

    const observer = new IntersectionObserver(([{ isIntersecting }]) => setScrolled(!isIntersecting), {
      rootMargin: "0px 0px 0px 0px",
      threshold: [1],
    });
    observer.observe(indicator);

    onCleanup(() => {
      observer.disconnect();
      indicator.remove();
    });
  });

  return (
    <header
      // TODO: make it so it doesn't transition until after the initial determination of if we are scrolled
      class={`sticky top-0 py-3 px-4 bg-neutral-50 z-10 [transition:box-shadow_100ms] ${
        hasScrolled() ? "shadow-sm" : ""
      }`}
    >
      <Content>
        <div class="flex justify-between font-serif font-title text-xl">
          <h1>
            <A href="/">CuteDog.app {/* animate to “Cute Dog” on scroll*/}</A>
          </h1>
        </div>
      </Content>
    </header>
  );
}
