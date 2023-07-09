import { css } from "~styled-system/css";
import { Card } from "./Card";
import { HiSolidCamera, HiSolidBars3CenterLeft, HiSolidXMark } from "solid-icons/hi";
import { createComputed, createEffect, createSignal, onCleanup } from "solid-js";
import { enableBodyScroll, disableBodyScroll } from "body-scroll-lock";
import { Content } from "./Content";
import { createCoordsStore } from "../signals/coords";
import { getLocalOffset, getUTCDateTime } from "../date";

export const InteractionEditor = (props: { onSave: (data: FormData) => Promise<void>; saving: boolean }) => {
  const [dialog, setDialog] = createSignal<HTMLDialogElement>();

  const [quote, setQuote] = createSignal("");
  const [photo, setPhoto] = createSignal<File>();
  const [photoPreviewURL, setPhotoPreviewURL] = createSignal("");

  const coords = createCoordsStore();

  createComputed(() => {
    if (photo()) {
      setPhotoPreviewURL(URL.createObjectURL(photo()!));
      onCleanup(() => URL.revokeObjectURL(photoPreviewURL()));
    } else {
      setPhotoPreviewURL("");
    }
  });

  createEffect(() => {
    const listener = () => {
      enableBodyScroll(dialog()!);
    };
    dialog()?.addEventListener("close", listener);
    onCleanup(() => dialog()?.removeEventListener("close", listener));
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
          onSubmit={async (event) => {
            event.preventDefault();

            if (!quote() || props.saving) {
              return;
            }

            const formData = new FormData();
            formData.set("quote", quote());
            formData.set("datetime", getUTCDateTime());
            formData.set("timezone", getLocalOffset());
            formData.set("lat", String(coords.lat));
            formData.set("lon", String(coords.lon));
            if (photo()) formData.set("photo", photo()!);
            await props.onSave(formData);
            setQuote("");
            setPhoto(undefined);
            dialog()?.close();
            window.scrollTo(0, 0);
          }}
        >
          <div class={css({ paddingBlock: "4", display: "flex", justifyContent: "space-between" })}>
            <button
              type="button"
              onclick={() => {
                if (!props.saving) {
                  dialog()!.close();
                }
              }}
            >
              Close
            </button>
            <button>{props.saving ? "Uploading..." : "Save"}</button>
          </div>
          <div class={css({ display: "grid", gap: "8", paddingBlock: "4" })}>
            <div
              class={css({
                fontFamily: "serif",
                fontWeight: "title",
                fontSize: "xl",
                display: "grid",
                maxW: "full",
                overflowX: "hidden",
              })}
            >
              <div aria-hidden class={css({ gridArea: "1/1", visibility: "hidden", whiteSpace: "pre-wrap" })}>
                {/*
                  NOTE: This is not currently necessary since new lines are being restricted,
                  but in the case that changes this hack is needed to keep this div mirroring the backing text area.
                  This keeps up the illusion that the textarea is wrapping while actuall this div is.
                */}
                {quote().endsWith("\n") ? quote() + " " : quote()}
              </div>
              <textarea
                autofocus
                rows="1"
                placeholder="Cute dog"
                value={quote()}
                oninput={({ target }) => {
                  target.value = target.value.replaceAll("\n", "");
                  setQuote(target.value);
                }}
                class={css({
                  resize: "none",
                  outline: "none",
                  gridArea: "1/1",
                  height: "full",
                  maxWidth: "full",
                  wordWrap: "break-word",
                  _placeholder: {
                    color: "neutral.400",
                  },
                })}
              />
            </div>
            {photoPreviewURL() ? (
              <div class={css({ pos: "relative", width: "full", maxWidth: "xs" })}>
                <img alt="" src={photoPreviewURL()} class={css({ borderRadius: "md" })} />
                <button
                  type="button"
                  class={css({ pos: "absolute", top: "3", right: "3", color: "white" })}
                  onclick={() => {
                    setPhoto(undefined);
                  }}
                >
                  <HiSolidXMark />
                </button>
              </div>
            ) : (
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
                      oninput={(event) => {
                        setPhoto(() => event.target.files?.[0]);
                      }}
                      class={css({ opacity: "0", appearance: "none", pos: "absolute", inset: "0", cursor: "pointer" })}
                    />
                  </div>
                </div>
              </label>
            )}
          </div>
        </form>
      </dialog>
    </>
  );
};
