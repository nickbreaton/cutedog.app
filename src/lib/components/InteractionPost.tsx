import { InteractionResult } from "../types";
import { For } from "solid-js";
import { HiSolidEllipsisHorizontal } from "solid-icons/hi";
import { getTimeZoneForIntl } from "../date";

function balaneQuoteText(text: string) {
  return text.replaceAll("I ", "I\u00A0");
}

export const InteractionPost = (props: { interaction: InteractionResult; onDelete: () => void }) => {
  return (
    <article class="-mx-4 sm:mx-0 bg-white border-neutral-200 border-y p-4 cursor-default sm:border-x sm:rounded-md">
      <div class="grid gap-2">
        <div class="grid grid-cols-[auto,theme(spacing.8)]">
          <div class="font-serif font-title text-xl grid gap-3">
            <For each={props.interaction.quotes}>
              {(quote) => (
                <p class="leading-snug [--indent:0.6ch] pl-[var(--indent)] indent-[calc(var(--indent)*-1)]">
                  “{balaneQuoteText(quote)}”
                </p>
              )}
            </For>
          </div>
          <button
            class="cursor-pointer aspect-square text-2xl grid place-items-center text-neutral-500"
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
            class="w-full rounded-md max-w-xs bg-neutral-100"
            loading="lazy"
          />
        )}
      </div>
    </article>
  );
};
