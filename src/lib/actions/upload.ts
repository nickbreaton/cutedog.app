import cloudinary from "cloudinary";
import { assertEnv } from "../env";
import { Readable } from "streamx";
import { Prisma } from '@prisma/client'
import { prisma } from "../database";

export async function uploadAction(form: FormData) {
  const quote = form.get("quote");
  const datetime = form.get("datetime");
  const timezone = form.get("timezone");
  const lat = parseFloat(form.get("lat") as string);
  const lon = parseFloat(form.get("lon") as string);
  const photo = form.get("photo") as File;

  if (!lat || !lon) {
    throw new Error("Request did not contain location data" + JSON.stringify({ lat, lon }));
  }

  const result = await new Promise<cloudinary.UploadApiResponse | null>(async (res, rej) => {
    if (!photo || photo.size === 0) {
      res(null);
      return;
    }

    const uploadStream = cloudinary.v2.uploader.upload_stream(
      { folder: assertEnv("CLOUDINARY_FOLDER") },
      (err, result) => {
        if (err) return rej(err);
        res(result!);
      },
    );

    const readableStream = Readable.from(photo.stream());
    readableStream.pipe(uploadStream);
  });

  await prisma.interaction.create({
    data: {
      quote: quote as string,
      datetime: datetime as string,
      timezone: timezone as string,
      lat: new Prisma.Decimal(lat),
      lng: new Prisma.Decimal(lon),
      photoID: result?.public_id
    }
  })
}
