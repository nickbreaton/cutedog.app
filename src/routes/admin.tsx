import { For } from "solid-js";
import { isDev } from "solid-js/web";
import { A, createRouteAction, useRouteData } from "solid-start";
import server$, { createServerAction$, createServerData$ } from "solid-start/server";
import exportAction from "~/lib/actions/export";
import { seedAction } from "~/lib/actions/seed";
import { Content } from "~/lib/components/Content";
import { getConnection } from "~/lib/database";

export function routeData() {
  return createServerData$(async () => {
    const results = await getConnection().execute("select datetime, quotes from interactions ORDER BY datetime DESC");
    return results.rows as Array<{ quotes: string[] }>;
  });
}

export default function Admin() {
  const interactions = useRouteData<typeof routeData>();

  const [, { Form: ExportForm }] = createRouteAction(exportAction);
  const [, { Form: SeedForm }] = createServerAction$(seedAction);
  const [, { Form: DeleteForm }] = createRouteAction(async (form: FormData) => {
    const exec = server$(async () => {
      await getConnection().execute("delete from interactions");
    });

    if (confirm("Are you sure")) {
      await exec();
    }
  });

  return (
    <Content>
      <div class="flex flex-col gap-10 py-5">
        {import.meta.env.PROD && (
          <h1 class="text-4xl font-title text-red-500">
            CAUTION:
            <br />
            THIS IS PRODUCTION
          </h1>
        )}

        <div class="flex gap-10">
          <A href="/">🔙 Home</A>
          <ExportForm>
            <button>⬇️ Export</button>
          </ExportForm>
          <SeedForm>
            <button>🌱 Seed DB</button>
          </SeedForm>
          <DeleteForm>
            <button>🚨 DELETE ALL</button>
          </DeleteForm>
        </div>
        <div>
          <strong>Interactions</strong>
          <ul>
            <For each={interactions()}>{(interaction) => <li>{interaction.quotes[0]}</li>}</For>
          </ul>
        </div>
      </div>
    </Content>
  );
}
