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
        class="
          fixed bottom-7 right-7 grid aspect-square w-14 cursor-pointer place-items-center
          rounded-full bg-blue-500 text-3xl text-white shadow-lg outline-none
        "
      >
        <HiSolidBars3CenterLeft />
      </button>
      <dialog
        ref={setDialog}
        class="
          modal:m-auto modal:h-full modal:max-h-full modal:w-full modal:max-w-full modal:px-4
          modal:sm:max-h-[theme(maxWidth.xl)] modal:sm:w-full modal:sm:max-w-xl modal:sm:rounded-md modal:sm:px-6 modal:sm:shadow-lg
        "
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
          <div class="flex justify-between py-4">
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
          <div class="grid gap-8 py-4">
            <div class="grid max-w-full overflow-x-hidden font-serif text-xl font-title">
              <div aria-hidden class="invisible whitespace-pre-wrap [grid-area:1/1]">
                {/*
                  NOTE: This is not currently necessary since new lines are being restricted,
                  but in the case that changes this hack is needed to keep this div mirroring the backing text area.
                  This keeps up the illusion that the textarea is wrapping while actuall this div is.
                */}
                {quote().endsWith("\n") ? quote() + " " : quote()}
              </div>
              <textarea
                autofocus
                onFocus={() => {
                  // prevents iOS from jumping to focus the input
                  dialog()!.hidden = true;
                  setTimeout(() => (dialog()!.hidden = false));
                }}
                rows="1"
                placeholder="Cute dog"
                value={quote()}
                oninput={({ target }) => {
                  target.value = target.value.replaceAll("\n", "");
                  setQuote(target.value);
                }}
                class="h-full max-w-full resize-none break-words outline-none [grid-area:1/1] placeholder:text-neutral-400"
              />
            </div>
            {photoPreviewURL() ? (
              <div class="relative w-full max-w-xs">
                <img alt="" src={photoPreviewURL()} class="rounded-md" />
                <button
                  type="button"
                  class="absolute right-3 top-3 text-white"
                  onclick={() => {
                    setPhoto(undefined);
                  }}
                >
                  <HiSolidXMark />
                </button>
              </div>
            ) : (
              <label class="relative z-0 grid aspect-square w-48 cursor-pointer place-items-center rounded-md border border-neutral-200 bg-neutral-100 placeholder:text-neutral-400">
                <div class="grid justify-center gap-1 font-title text-neutral-400">
                  <div class="flex justify-center text-2xl">
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
                      class="absolute inset-0 cursor-pointer appearance-none opacity-0"
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
