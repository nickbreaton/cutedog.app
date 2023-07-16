import { JSXElement, Show, createEffect, createSignal, onCleanup } from "solid-js";
import { Portal } from "solid-js/web";
import tippy from "tippy.js";

export default function Tooltip(props: { children: JSXElement; button: HTMLButtonElement }) {
  const [popper, setPopper] = createSignal<HTMLDivElement>();

  createEffect(() => {
    const instance = tippy(props.button, {
      trigger: "click",
      interactive: true,
      delay: [0, 0],
      duration: [0, 0],
      offset: ({ placement, popper, reference }) => {
        if (placement === "bottom") {
          return [popper.width / -2 + reference.width * (1 / 4), (-reference.height * 3) / 4];
        }
        return [0, 0];
      },
      placement: "bottom", // TODO: figure out how to disable movement when scrolling to bottom
      zIndex: 0,
      onTrigger(instance) {
        setPopper(instance.popper);
        instance.popper.addEventListener("click", () => {
          instance.hide();
        });
      },
      onHidden() {
        setPopper(undefined);
      },
    });

    const handleEscapeKeyPress = (event: KeyboardEvent) => {
      if (event.key === "Escape" && instance.state.isShown) {
        event.stopPropagation();
        instance.hide();
      }
    };

    document.addEventListener("keydown", handleEscapeKeyPress);

    onCleanup(() => {
      instance.destroy();
      document.removeEventListener("keydown", handleEscapeKeyPress);
    });
  });

  return <Show when={popper()}>{(mount) => <Portal mount={mount()}>{props.children}</Portal>}</Show>;
}
