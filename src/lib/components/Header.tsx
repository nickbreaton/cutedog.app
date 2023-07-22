import { Content } from "./Content";
import { createEffect, createSignal, onCleanup } from "solid-js";
import { A, useLocation } from "solid-start";

export function Header() {
  const { pathname } = useLocation();
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
      class={`sticky top-0 z-10 bg-neutral-50 px-4 py-3 [transition:box-shadow_100ms] ${
        hasScrolled() ? "shadow-sm" : ""
      }`}
    >
      <Content>
        <div class="flex justify-between font-serif text-xl font-title">
          <h1>
            <A
              href="/"
              onClick={() => {
                if (pathname === "/") {
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }
              }}
            >
              CuteDog.app {/* animate to “Cute Dog” on scroll*/}
            </A>
          </h1>
        </div>
      </Content>
    </header>
  );
}
