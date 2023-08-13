import { useRouteData } from "solid-start";
import { createServerAction$, createServerData$ } from "solid-start/server";
import { For } from "solid-js";
import cloudinary from "cloudinary";
import { InteractionResult } from "~/lib/types";
import { uploadAction } from "~/lib/actions/upload";
import { Content } from "~/lib/components/Content";
import { getCityState } from "~/lib/maps";
import { imageSize } from "image-size";
import https from "node:https";
import { InteractionPost } from "~/lib/components/InteractionPost";
import { InteractionEditor } from "~/lib/components/InteractionEditor";
import { Prisma } from '@prisma/client'
import { prisma } from "~/lib/database";

export function routeData() {
  return createServerData$(async (): Promise<InteractionResult[]> => {
    const results = await prisma.interaction.findMany();
    const interactionResultsPromises = results.map(async (interaction) => {
      if (!interaction.cachedCity || !interaction.cachedState) {
        const { city, state } = await getCityState(interaction.lat.toString(), interaction.lng.toString());
        interaction.cachedCity = city;
        interaction.cachedState = state;
        await prisma.interaction.update({
          where: { id: interaction.id },
          data: { cachedCity: city, cachedState: state }
        })
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
        interaction.cachedPhotoAspectRatio = new Prisma.Decimal(width! / height!);
        await prisma.interaction.update({
          where: { id: interaction.id },
          data: { cachedPhotoAspectRatio: interaction.cachedPhotoAspectRatio }
        })
      }

      return {
        ...interaction,
        photoURL,
        cachedPhotoAspectRatio: interaction.cachedPhotoAspectRatio?.toNumber()
      };
    });

    return Promise.all(interactionResultsPromises);
  });
}

export default function Home() {
  const interactions = useRouteData<typeof routeData>();

  const [adding, addInteraction] = createServerAction$(uploadAction);
  const [, deleteInteraction] = createServerAction$(async (id: number) => {
    await prisma.interaction.delete({ where: { id }})
  });

  return (
    <Content>
      <InteractionEditor onSave={addInteraction} saving={adding.pending} />
      <div class="grid gap-5 pb-6 pt-3">
        <For each={interactions()}>
          {(interaction) => (
            <InteractionPost interaction={interaction} onDelete={() => deleteInteraction(interaction.id)} />
          )}
        </For>
      </div>
    </Content>
  );
}
