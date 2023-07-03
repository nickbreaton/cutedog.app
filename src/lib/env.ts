import env from "env-var";

export const database = {
  host: env.get("DATABASE_HOST").required().asString(),
  username: env.get("DATABASE_USERNAME").required().asString(),
  password: env.get("DATABASE_PASSWORD").required().asString(),
};

export const cloudinary = {
  cloudName: env.get("CLOUDINARY_CLOUD_NAME").required().asString(),
  apiKey: env.get("CLOUDINARY_API_KEY").required().asString(),
  apiSecret: env.get("CLOUDINARY_API_SECRET").required().asString(),
  folder: env.get("CLOUDINARY_FOLDER").required().asString(),
};

export const auth = {
  password: env.get("PASSWORD").required().asString(),
};
