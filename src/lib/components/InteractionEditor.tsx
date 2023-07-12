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
          fixed right-7 bottom-7 bg-blue-500 text-white w-14 aspect-square rounded-full
          shadow-lg cursor-pointer outline-none text-3xl grid place-items-center
        "
      >
        <HiSolidBars3CenterLeft />
      </button>
      <dialog
        ref={setDialog}
        class="
          modal:w-full modal:max-w-full modal:h-full modal:max-h-full modal:m-auto modal:px-4
          modal:sm:shadow-lg modal:sm:rounded-md modal:sm:max-w-xl modal:sm:w-full modal:sm:max-h-[theme(maxWidth.xl)] modal:sm:px-6
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
          <div class="py-4 flex justify-between">
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
            <div class="font-serif font-title text-xl grid max-w overflow-x-hidden">
              <div aria-hidden class="[grid-area:1/1] invisible whitespace-pre-wrap">
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
                class="resize-none outline-none [grid-area:1/1] h-full max-w-full break-words placeholder:text-neutral-400"
              />
            </div>
            {photoPreviewURL() ? (
              <div class="relative w-full max-w-xs">
                <img alt="" src={photoPreviewURL()} class="rounded-md" />
                <button
                  type="button"
                  class="ablute top-3 right-3 text-white"
                  onclick={() => {
                    setPhoto(undefined);
                  }}
                >
                  <HiSolidXMark />
                </button>
              </div>
            ) : (
              <label class="w-48 aspect-square bg-neutral-100 border border-neutral-200 rounded-md relative z-0 cursor-pointer grid place-items-center placeholder:text-neutral-400">
                <div class="grid justify-center font-title text-neutral-400 gap-1">
                  <div class="text-2xl flex justify-center">
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
                      class="opacity-0 appearance-none absolute inset-0 cursor-pointer"
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
