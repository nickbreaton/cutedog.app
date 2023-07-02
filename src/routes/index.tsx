import { createRouteData, useRouteData } from "solid-start";
import { connect } from "@planetscale/database";
import { createServerAction$, createServerData$ } from "solid-start/server";
import { createComponent, createComputed, createEffect, onCleanup } from "solid-js";
import { getUTCDateTime } from "~/lib/date";
import { createStore } from "solid-js/store";
import { isServer } from "solid-js/web";

const config = {
  // cast: (field, value) => {
  //   console.log(field, value);

  //   return value;
  // },
  host: process.env.DATABASE_HOST,
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
};

interface Interaction {
  id: number;
  datetime: string;
  quotes: string[];
  lat: number;
  lon: number;
  description?: string;
}

export function routeData() {
  return createServerData$(async () => {
    const conn = connect(config);

    const results = await conn.execute("select id, datetime, quotes, lat, lon from interactions");
    const rows = results.rows as Interaction[];

    return rows;
  });
}

function createCoordsStore() {
  const [store, set] = createStore({ lat: 0, lon: 0 });

  createComputed(() => {
    if (!isServer) {
      function run() {
        navigator.geolocation.getCurrentPosition((position) => {
          set({
            lat: position.coords.latitude,
            lon: position.coords.longitude,
          });

          const timeout = setTimeout(() => {
            run();
          }, 1000);

          onCleanup(() => clearTimeout(timeout));
        });
      }
      run();
    }
  });

  return store;
}

export default function Home() {
  const read = useRouteData<typeof routeData>();
  const coords = createCoordsStore();

  const [, { Form }] = createServerAction$(async (form: FormData, { request }) => {
    const quote = form.get("quote");
    const datetime = form.get("datetime");
    const lat = parseFloat(form.get("lat") as string);
    const lon = parseFloat(form.get("lon") as string);
    const photo = form.get("photo") as File;
    console.log(Buffer.from(await photo.arrayBuffer()));

    const conn = connect(config);

    await conn.execute("insert into interactions (quotes, datetime, lat, lon, photo) VALUES (?, ?, ?, ?, ?)", [
      JSON.stringify([quote]),
      datetime,
      lat,
      lon,
      photo,
    ]);
  });

  const [, { Form: DeleteForm }] = createServerAction$(async (form: FormData) => {
    const conn = connect(config);
    await conn.execute("delete from interactions");
  });

  return (
    <div>
      <Form style={{ display: "grid", "max-width": "400px", gap: "20px" }}>
        new:
        <input type="text" name="quote" value="Cute dog" />
        <input type="text" name="datetime" value={getUTCDateTime()} />
        <div>
          <input type="text" name="lat" value={coords.lat} />
          <input type="text" name="lon" value={coords.lon} />
        </div>
        <input type="file" name="photo" />
        <button>Save</button>
      </Form>
      results:
      <pre>{JSON.stringify(read(), null, 2)}</pre>
      <DeleteForm>
        <button>🚨 DELETE ALL</button>
      </DeleteForm>
    </div>
  );
}
