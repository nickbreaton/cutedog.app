import { css } from "~styled-system/css";
import { Content } from "./Content";
import { createEffect, createSignal, onCleanup } from "solid-js";

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
      style={{ transition: "box-shadow 100ms" }}
      classList={{
        [css({ pos: "sticky", top: "0", paddingBlock: "3", background: "gray.50" })]: true,
        [css({ boxShadow: "xs" })]: hasScrolled(),
      }}
    >
      <Content>
        <h1
          class={css({
            fontFamily: "serif",
            fontWeight: "title",
            fontSize: "xl",
          })}
        >
          CuteDog.app {/* animate to “Cute Dog” on scroll*/}
        </h1>
      </Content>
    </header>
  );
}
