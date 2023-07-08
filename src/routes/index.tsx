import { Link, createRouteAction, createRouteData, useRouteData } from "solid-start";
import { createServerAction$, createServerData$ } from "solid-start/server";
import { For, JSX, PropsWithChildren, createComponent, createComputed, createEffect, onCleanup } from "solid-js";
import { getTimeZoneForIntl, getLocalOffset, getUTCDateTime } from "~/lib/date";
import { createStore } from "solid-js/store";
import { isServer } from "solid-js/web";
import { getConnection } from "~/lib/database";
import cloudinary from "cloudinary";
import { css } from "~styled-system/css";
import { Interaction, InteractionResult } from "~/lib/types";
import { uploadAction } from "~/lib/actions/upload";
import { grid } from "~styled-system/patterns";
import { Content } from "~/lib/components/Content";
import { getCityState } from "~/lib/maps";
import { imageSize } from "image-size";
import https from "node:https";
import { createCoordsStore } from "~/lib/signals/coords";

export function routeData() {
  return createServerData$(async (): Promise<InteractionResult[]> => {
    const results = await getConnection().execute("select * from interactions ORDER BY datetime DESC");
    const rows = results.rows as Interaction[];
    const interactionResultsPromises = rows.map(async (interaction) => {
      if (!interaction.cachedCity || !interaction.cachedState) {
        const { city, state } = await getCityState(interaction.lat, interaction.lon);
        interaction.cachedCity = city;
        interaction.cachedState = state;
        await getConnection().execute("UPDATE interactions SET cachedCity = ?, cachedState = ? WHERE id = ?", [
          interaction.cachedCity,
          interaction.cachedState,
          interaction.id,
        ]);
      }

      const photoURL = interaction.photoID
        ? cloudinary.v2.url(interaction.photoID, { secure: true, fetch_format: "auto", quality: "auto" })
        : undefined;

      if (photoURL && !interaction.cachedPhotoAspectRatio) {
        const imageBuffer = await new Promise<Buffer>((res, rej) => {
          https.get(photoURL, (response) => {
            const chunks: Uint8Array[] = [];
            response.on("data", (chunk) => chunks.push(chunk));
            response.on("end", () => res(Buffer.concat(chunks)));
            response.on("error", (error) => rej(error));
          });
        });
        const { width, height } = imageSize(imageBuffer);
        interaction.cachedPhotoAspectRatio = width! / height!;
        await getConnection().execute("UPDATE interactions SET cachedPhotoAspectRatio = ? WHERE id = ?", [
          interaction.cachedPhotoAspectRatio,
          interaction.id,
        ]);
      }

      return {
        ...interaction,
        photoURL,
      };
    });

    return Promise.all(interactionResultsPromises);
  });
}

function balaneQuoteText(text: string) {
  return text.replaceAll("I ", "I\u00A0");
}

export default function Home() {
  const interactions = useRouteData<typeof routeData>();
  const coords = createCoordsStore();

  const [, { Form }] = createServerAction$(uploadAction);

  return (
    <Content>
      <Form style={{ display: "grid", "max-width": "200px", gap: "20px" }}>
        new:
        <input type="text" name="quote" value="Cute dog" class={css({ w: "8/12" })} />
        <input type="text" name="datetime" value={getUTCDateTime()} class={css({ w: "8/12" })} />
        <input type="text" name="timezone" value={getLocalOffset()} class={css({ w: "8/12" })} />
        <div>
          <input type="text" name="lat" value={coords.lat} />
          <input type="text" name="lon" value={coords.lon} />
        </div>
        <input type="file" name="photo" class={css({ w: "8/12" })} />
        <button>Save</button>
      </Form>
      <div class={grid({ gap: "5" })}>
        <For each={interactions()}>
          {(interaction) => (
            <article
              class={css({
                bg: "white",
                boxShadow: "sm",
                borderRadius: "md",
                p: "4",
                cursor: "default",
                display: "grid",
              })}
              style={{ "grid-template-columns": "3fr 2fr" }}
            >
              <div class={css({ display: "flex", flexDir: "column", gap: "2" })}>
                {/* TODO: font looking weird in Safari */}
                <div
                  class={css({ fontFamily: "serif", fontWeight: "title", fontSize: "2xl", display: "grid", gap: "3" })}
                >
                  <For each={interaction.quotes}>
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
                <div>
                  {new Intl.DateTimeFormat("en-US", {
                    dateStyle: "medium",
                    timeStyle: "short",
                    timeZone: getTimeZoneForIntl(interaction.timezone),
                  }).format(new Date(`${interaction.datetime}+0000`))}
                </div>
                <div>
                  {interaction.cachedCity}, {interaction.cachedState}
                </div>
              </div>
              <img src={interaction.photoURL} class={css({ w: "full", borderRadius: "xs", boxShadow: "xs" })} />
            </article>
          )}
        </For>
      </div>
    </Content>
  );
}
