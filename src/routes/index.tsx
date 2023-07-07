import { Link, createRouteAction, createRouteData, useRouteData } from "solid-start";
import { createServerAction$, createServerData$ } from "solid-start/server";
import { For, JSX, PropsWithChildren, createComponent, createComputed, createEffect, onCleanup } from "solid-js";
import { getDateFromTimezoneOffset, getLocalOffset, getUTCDateTime } from "~/lib/date";
import { createStore } from "solid-js/store";
import { isDev, isServer } from "solid-js/web";
import { getConnection } from "~/lib/database";
import cloudinary from "cloudinary";
import { Readable } from "streamx";
import { css } from "~styled-system/css";
import { assertEnv } from "~/lib/env";
import { Interaction, InteractionResult } from "~/lib/types";
import { uploadAction } from "~/lib/actions/upload";
import { createLazyRouteAction } from "~/lib/start";
import { grid, vstack } from "~styled-system/patterns";
import { seedAction } from "~/lib/actions/seed";

// TODO: needs to be included or lazy loaded route won't load, this will tree shake away
import * as noop1 from "~/lib/actions/export";
import { Content } from "~/lib/components/Content";

export function routeData() {
  return createServerData$(async (): Promise<InteractionResult[]> => {
    const results = await getConnection().execute(
      "select id, datetime, timezone, quotes, lat, lon, photoID from interactions ORDER BY datetime DESC"
    );
    const rows = results.rows as Interaction[];

    return rows.map((interaction) => ({
      ...interaction,
      photoURL: interaction.photoID
        ? cloudinary.v2.url(interaction.photoID, { secure: true, fetch_format: "auto", quality: "auto" })
        : undefined,
    }));
  });
}

function createCoordsStore() {
  const [store, set] = createStore({ lat: 0, lon: 0 });

  createComputed(() => {
    if (isServer) {
      return;
    }

    let timeout: NodeJS.Timeout;

    function update() {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude: lat, longitude: lon } = position.coords;
        set({ lat, lon });
        timeout = setTimeout(update, 1000);
      });
    }

    update();
    onCleanup(() => clearTimeout(timeout));
  });

  return store;
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
                display: "grid",
                gap: "2",
                cursor: "default",
              })}
            >
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
              {/* TODO: fix time formatting based on TZ */}
              <div>{getDateFromTimezoneOffset(interaction.datetime, interaction.timezone).toLocaleString()}</div>
              {/* <img src={interaction.photoURL} class={css({ w: "full" })} /> */}
            </article>
          )}
        </For>
      </div>
    </Content>
  );
}
