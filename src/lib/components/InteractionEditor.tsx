import { css } from "~styled-system/css";
import { Card } from "./Card";
import { HiSolidCamera, HiSolidBars3CenterLeft } from "solid-icons/hi";
import { createEffect, createSignal } from "solid-js";
import { enableBodyScroll, disableBodyScroll } from "body-scroll-lock";
import { Content } from "./Content";

export const InteractionEditor = (props: { onSave: (data: FormData) => void }) => {
  const [dialog, setDialog] = createSignal<HTMLDialogElement>();

  const [quote, setQuote] = createSignal("hello world this should wrap again and again and again");

  createEffect(() => {
    dialog()!.showModal();
    disableBodyScroll(dialog()!);

    dialog()!.addEventListener("close", () => {
      enableBodyScroll(dialog()!);
    });
  });

  return (
    <>
      <button
        onclick={() => {
          dialog()!.showModal();
          disableBodyScroll(dialog()!);
        }}
        class={css({
          pos: "fixed",
          right: "7",
          bottom: "7",
          background: "blue.500",
          color: "white",
          width: "14",
          aspectRatio: "square",
          borderRadius: "full",
          boxShadow: "lg",
          cursor: "pointer",
          outline: "none",
          fontSize: "3xl",
          display: "grid",
          placeItems: "center",
        })}
      >
        <HiSolidBars3CenterLeft />
      </button>
      <dialog
        ref={setDialog}
        class={css({
          "&:modal": {
            width: "full",
            maxWidth: "full",
            height: "full",
            maxHeight: "full",
            m: "auto",
            paddingInline: "4",
            sm: {
              boxShadow: "lg",
              borderRadius: "md",
              margin: "auto",
              w: "xl",
              maxW: "11/12",
              maxHeight: "lg",
              paddingInline: "6",
            },
          },
        })}
      >
        <form
          onSubmit={(event) => {
            event.preventDefault();
            const formData = new FormData();
            formData.set("quote", quote());
            formData.set("datetime", "");
            formData.set("timezone", "");
            formData.set("lat", "");
            formData.set("lon", "");
            formData.set("photo", "");
            props.onSave(formData);
          }}
        >
          <div class={css({ paddingBlock: "4", display: "flex", justifyContent: "space-between" })}>
            <button onclick={() => dialog()!.close()}>Close</button>
            <button>Save</button>
          </div>
          <div class={css({ display: "grid", gap: "8", paddingBlock: "4" })}>
            <div
              class={css({ fontFamily: "serif", fontWeight: "title", fontSize: "xl", display: "grid", maxW: "full" })}
            >
              <div aria-hidden class={css({ gridArea: "1/1", visibility: "hidden", whiteSpace: "pre-wrap" })}>
                {quote().endsWith("\n") ? quote() + " " : quote()}
              </div>
              <textarea
                // @ts-ignore
                autofocus
                rows="1"
                // attr:autofocus=""
                // contentEditable
                value={quote()}
                oninput={({ target }) => {
                  console.log(target.value);

                  // if (!target.textContent) target.textContent = "";
                  setQuote(target.value);
                }}
                class={css({
                  resize: "none",
                  outline: "none",
                  gridArea: "1/1",
                  height: "full",
                  maxWidth: "full",
                  wordWrap: "break-word",
                  // _empty: {
                  //   _before: {
                  //     color: "neutral.400",
                  //     content: "'“Cute dog”'",
                  //   },
                  // },
                })}
              />
            </div>
            <label
              class={css({
                w: "48",
                aspectRatio: "square",
                background: "neutral.100",
                borderWidth: "thin",
                borderColor: "neutral.200",
                borderRadius: "md",
                pos: "relative",
                zIndex: "0",
                cursor: "pointer",
                display: "grid",
                placeItems: "center",
                _placeholder: {
                  color: "neutral.400",
                },
              })}
            >
              <div
                class={css({
                  display: "grid",
                  justifyItems: "center",
                  fontWeight: "bold",
                  color: "neutral.400",
                  gap: "1",
                })}
              >
                <div class={css({ fontSize: "2xl" })}>
                  <HiSolidCamera />
                </div>
                <div>
                  Upload a Photo
                  <input
                    type="file"
                    name="photo"
                    class={css({ opacity: "0", appearance: "none", pos: "absolute", inset: "0", cursor: "pointer" })}
                  />
                </div>
              </div>
            </label>
            {/* <button
                classList={{
                  [css({
                    justifySelf: "end",
                    paddingInline: "4",
                    paddingBlock: "1",
                    borderRadius: "sm",
                    fontWeight: "bold",
                    fontSize: "md",
                  })]: true,
                  [css({ bg: "neutral.200", color: "neutral.400", cursor: "not-allowed" })]: true,
                  // [css({ bg: "orange.500", color: "white", cursor: "pointer" })]: true,
                }}
              >
                Save
              </button> */}
          </div>
        </form>
      </dialog>
    </>
  );
};
