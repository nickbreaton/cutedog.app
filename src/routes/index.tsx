import { Link, createRouteAction, createRouteData, useRouteData } from "solid-start";
import { createServerAction$, createServerData$ } from "solid-start/server";
import { For, JSX, createComponent, createComputed, createEffect, onCleanup } from "solid-js";
import { getTimeZoneForIntl, getLocalOffset, getUTCDateTime } from "~/lib/date";
import { createStore } from "solid-js/store";
import { isServer } from "solid-js/web";
import { getConnection } from "~/lib/database";
import cloudinary from "cloudinary";
import { css } from "~styled-system/css";
import { styled } from "~styled-system/jsx";
import { Interaction, InteractionResult } from "~/lib/types";
import { uploadAction } from "~/lib/actions/upload";
import { grid } from "~styled-system/patterns";
import { Content } from "~/lib/components/Content";
import { getCityState } from "~/lib/maps";
import { imageSize } from "image-size";
import https from "node:https";
import { createCoordsStore } from "~/lib/signals/coords";
import { token } from "~styled-system/tokens";
import { HiSolidEllipsisHorizontal, HiSolidCamera } from "solid-icons/hi";
import { Card } from "~/lib/components/Card";
import { InteractionPost } from "~/lib/components/InteractionPost";
import { InteractionEditor } from "~/lib/components/InteractionEditor";

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

export default function Home() {
  const interactions = useRouteData<typeof routeData>();
  const coords = createCoordsStore();

  const [, addInteraction] = createServerAction$(uploadAction);
  const [, deleteInteraction] = createServerAction$(async (id: number) => {
    await getConnection().execute("DELETE FROM interactions WHERE id = ?", [id]);
  });

  return (
    <Content>
      {/* <Form style={{ display: "grid", "max-width": "200px", gap: "20px" }}>
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
      </Form> */}
      <InteractionEditor onSave={addInteraction} />
      <div class={grid({ gap: "5" })}>
        <For each={interactions()}>
          {(interaction) => (
            <InteractionPost interaction={interaction} onDelete={() => deleteInteraction(interaction.id)} />
          )}
        </For>
      </div>
    </Content>
  );
}
