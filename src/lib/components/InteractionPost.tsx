import { InteractionResult } from "../types";
import { For, createSignal, lazy } from "solid-js";
import { HiSolidEllipsisHorizontal, HiSolidTrash, HiSolidPencilSquare } from "solid-icons/hi";
import { getTimeZoneForIntl } from "../date";

function balaneQuoteText(text: string) {
  return text.replaceAll("I ", "I\u00A0");
}

const PostMenu = lazy(() => import("./PostMenu"));

export const InteractionPost = (props: { interaction: InteractionResult; onDelete: () => void }) => {
  const [button, setButton] = createSignal<HTMLButtonElement>();

  return (
    <article class="-mx-4 cursor-default border-y border-neutral-200 bg-white p-4 sm:mx-0 sm:rounded-md sm:border-x">
      <div class="grid gap-2">
        <div class="grid grid-cols-[auto,theme(spacing.8)]">
          <div class="grid gap-3 font-serif text-xl font-title">
            <For each={props.interaction.quotes}>
              {(quote) => (
                <p class="pl-[var(--indent)] indent-[calc(var(--indent)*-1)] leading-snug [--indent:0.6ch]">
                  “{balaneQuoteText(quote)}”
                </p>
              )}
            </For>
          </div>
          <button
            class="grid aspect-square cursor-default place-items-center content-center rounded-full text-2xl text-neutral-500
            aria-[expanded=false]:hover:cursor-pointer aria-[expanded=false]:hover:bg-neutral-50 aria-[expanded=false]:active:bg-neutral-100"
            ref={setButton}
          >
            <HiSolidEllipsisHorizontal />
          </button>
          <PostMenu button={button()!}>
            <div class="grid animate-grid-reveal">
              <div class="overflow-hidden rounded-md border border-neutral-200 bg-white shadow-sm shadow-neutral-50">
                <For
                  each={[
                    // {
                    //   text: "Edit",
                    //   icon: <HiSolidPencilSquare />,
                    //   class: "",
                    //   onClick: () => console.log("TODO: edit action"),
                    // },
                    {
                      text: "Delete",
                      icon: <HiSolidTrash />,
                      class: "text-red-500",
                      onClick: () => {
                        if (window.confirm("Delete?")) {
                          props.onDelete();
                        }
                      },
                    },
                  ]}
                >
                  {(item) => (
                    <button
                      class={`flex min-w-full items-center gap-2 py-2 pl-4 pr-6 -outline-offset-1 hover:bg-neutral-50 active:bg-neutral-100  ${item.class}`}
                      onClick={item.onClick}
                    >
                      {item.icon}
                      {item.text}
                    </button>
                  )}
                </For>
              </div>
            </div>
          </PostMenu>
        </div>
        <div>
          {new Intl.DateTimeFormat("en-US", {
            dateStyle: "medium",
            timeStyle: "short",
            timeZone: getTimeZoneForIntl(props.interaction.timezone),
          }).format(new Date(`${props.interaction.datetime}+0000`))}
        </div>
        <div>
          {props.interaction.cachedCity}, {props.interaction.cachedState}
        </div>
        {props.interaction.photoURL && (
          <img
            alt=""
            src={props.interaction.photoURL}
            style={{ "aspect-ratio": props.interaction.cachedPhotoAspectRatio }}
            class="w-full max-w-xs rounded-md bg-neutral-100"
            loading="lazy"
          />
        )}
      </div>
    </article>
  );
};
