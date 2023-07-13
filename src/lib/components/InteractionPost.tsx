import { InteractionResult } from "../types";
import { For } from "solid-js";
import { HiSolidEllipsisHorizontal } from "solid-icons/hi";
import { getTimeZoneForIntl } from "../date";

function balaneQuoteText(text: string) {
  return text.replaceAll("I ", "I\u00A0");
}

export const InteractionPost = (props: { interaction: InteractionResult; onDelete: () => void }) => {
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
            class="grid aspect-square cursor-pointer place-items-center text-2xl text-neutral-500"
            onclick={() => {
              if (confirm("Delete?")) {
                props.onDelete();
              }
            }}
          >
            <HiSolidEllipsisHorizontal />
          </button>
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
