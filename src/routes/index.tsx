import { Link, createRouteData, useRouteData } from "solid-start";
import { createServerAction$, createServerData$ } from "solid-start/server";
import { For, createComponent, createComputed, createEffect, onCleanup } from "solid-js";
import { getLocalOffset, getUTCDateTime } from "~/lib/date";
import { createStore } from "solid-js/store";
import { isServer } from "solid-js/web";
import { getConnection } from "~/lib/database";
import cloudinary from "cloudinary";
import { Readable } from "streamx";

interface Interaction {
  id: number;
  datetime: string;
  quotes: string[];
  lat: number;
  lon: number;
  photoID?: string;
  description?: string;
}

interface InteractionResult extends Interaction {
  photoURL?: string;
}

export function routeData() {
  return createServerData$(async (): Promise<InteractionResult[]> => {
    const results = await getConnection().execute("select id, datetime, quotes, lat, lon, photoID from interactions");
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

export default function Home() {
  const interactions = useRouteData<typeof routeData>();
  const coords = createCoordsStore();

  const [, { Form }] = createServerAction$(async (form: FormData, { request }) => {
    const quote = form.get("quote");
    const datetime = form.get("datetime");
    const timezone = form.get("timezone");
    const lat = parseFloat(form.get("lat") as string);
    const lon = parseFloat(form.get("lon") as string);
    const photo = form.get("photo") as File;

    const result = await new Promise<cloudinary.UploadApiResponse | null>(async (res, rej) => {
      if (!photo || photo.size === 0) {
        res(null);
        return;
      }

      const uploadStream = cloudinary.v2.uploader.upload_stream({ folder: "/cutedog-dev" }, (err, result) => {
        if (err) return rej(err);
        res(result!);
      });

      const readableStream = Readable.from(photo.stream());
      readableStream.pipe(uploadStream);
    });

    await getConnection().execute(
      "insert into interactions (quotes, datetime, timezone, lat, lon, photoID) VALUES (?, ?, ?, ?, ?, ?)",
      [JSON.stringify([quote]), datetime, timezone, lat, lon, result?.public_id]
    );
  });

  const [, { Form: DeleteForm }] = createServerAction$(async (form: FormData) => {
    await getConnection().execute("delete from interactions");
  });
  return (
    <div>
      <Form style={{ display: "grid", "max-width": "400px", gap: "20px" }}>
        new:
        <input type="text" name="quote" value="Cute dog" />
        <input type="text" name="datetime" value={getUTCDateTime()} />
        <input type="text" name="timezone" value={getLocalOffset()} />
        <div>
          <input type="text" name="lat" value={coords.lat} />
          <input type="text" name="lon" value={coords.lon} />
        </div>
        <input type="file" name="photo" />
        <button>Save</button>
      </Form>
      results:
      <For each={interactions()}>
        {(interaction) => (
          <div>
            <pre>{JSON.stringify(interaction, null, 2)}</pre>
            <img src={interaction.photoURL} style={{ "max-width": "500px" }} />
          </div>
        )}
      </For>
      <DeleteForm>
        <button>🚨 DELETE ALL</button>
      </DeleteForm>
    </div>
  );
}
