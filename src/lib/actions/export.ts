import { createServerAction$ } from "solid-start/server";
import { getConnection } from "../database";
import { InteractionResult } from "../types";
import cloudinary from "cloudinary";
import { createRouteAction } from "solid-start";

export function createExportAction() {
  const [, exportRecords] = createServerAction$(async () => {
    const { rows, fields } = await getConnection().execute("select * from interactions");
    const rowsWithURL: InteractionResult[] = (rows as any[]).map((interaction: InteractionResult) => ({
      ...interaction,
      photoURL: interaction.photoID ? cloudinary.v2.url(interaction.photoID, { secure: true }) : undefined,
    }));
    return { rows: rowsWithURL, fields };
  });

  return createRouteAction(async () => {
    const name = "cutedog";

    const recordsPromise = exportRecords();

    const [{ default: JSZip }, { default: pLimit }] = await Promise.all([import("jszip"), import("p-limit")]);

    const zip = new JSZip();
    const root = zip.folder(name)!;

    const records = await recordsPromise;
    root.file("contents.json", JSON.stringify(await recordsPromise, null, 2));

    const images = root.folder("images")!;
    const limit = pLimit(10);

    await Promise.all(
      records.rows.map((row: any) =>
        limit(async () => {
          const interactionResult = row as InteractionResult;

          if (!interactionResult.photoURL) {
            return;
          }

          const res = await fetch(interactionResult.photoURL);
          const ext = res.headers.get("content-type")!.replace("image/", "");

          images.file(`${interactionResult.id}.${ext}`, await res.blob());
        })
      )
    );

    const blob = await zip.generateAsync({ type: "blob" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${name}.zip`;
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  });
}
