import { css } from "~styled-system/css";
import { Card } from "./Card";
import { InteractionResult } from "../types";
import { For } from "solid-js";
import { token } from "~styled-system/tokens";
import { HiSolidEllipsisHorizontal } from "solid-icons/hi";
import { getTimeZoneForIntl } from "../date";

function balaneQuoteText(text: string) {
  return text.replaceAll("I ", "I\u00A0");
}

export const InteractionPost = (props: { interaction: InteractionResult; onDelete: () => void }) => {
  return (
    <div class={css({ marginInline: { base: "-4", sm: "0" } })}>
      <Card>
        <div class={css({ display: "grid", gap: "2" })}>
          <div class={css({ display: "grid" })} style={{ "grid-template-columns": `auto ${token("sizes.8")}` }}>
            <div
              class={css({
                fontFamily: "serif",
                fontWeight: "title",
                fontSize: "xl",
                display: "grid",
                gap: "3",
              })}
            >
              <For each={props.interaction.quotes}>
                {(quote) => (
                  <p
                    style={{
                      "--indent": "0.6ch",
                      "padding-left": "var(--indent)",
                      "text-indent": "calc(var(--indent)*-1)",
                    }}
                    class={css({ lineHeight: "snug" })}
                  >
                    “{balaneQuoteText(quote)}”
                  </p>
                )}
              </For>
            </div>
            <button
              onclick={() => {
                if (confirm("Delete?")) {
                  props.onDelete();
                }
              }}
              class={css({
                cursor: "pointer",
                aspectRatio: "square",
                fontSize: "2xl",
                display: "grid",
                placeItems: "center",
                color: "neutral.500",
              })}
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
              class={css({
                w: "full",
                borderRadius: "md",
                maxWidth: "xs",
              })}
              loading="lazy"
            />
          )}
        </div>
      </Card>
    </div>
  );
};
