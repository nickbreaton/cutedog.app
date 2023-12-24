import server$ from "solid-start/server";
import { getConnection } from "../database";
import { InteractionResult } from "../types";
import cloudinary from "cloudinary";
import JSZip from "jszip";
import pLimit from "p-limit";

const exportRecords = server$(async () => {
  const { rows, fields } = await getConnection().execute("select * from interactions");
  const rowsWithURL: InteractionResult[] = (rows as any[]).map((interaction: InteractionResult) => ({
    ...interaction,
    photoURL: interaction.photoID ? cloudinary.v2.url(interaction.photoID, { secure: true }) : undefined,
  }));
  return { rows: rowsWithURL, fields };
});

export default async function (form: FormData) {
  const name = "cutedog";

  const zip = new JSZip();
  const root = zip.folder(name)!;

  const records = await exportRecords();
  root.file("contents.json", JSON.stringify(records, null, 2));

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
      }),
    ),
  );

  const blob = await zip.generateAsync({ type: "blob" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  // TODO: prepend sortable timestamp to end of file
  a.download = `${name}.zip`;
  a.click();
  a.remove();
  URL.revokeObjectURL(url);

  return null;
}
