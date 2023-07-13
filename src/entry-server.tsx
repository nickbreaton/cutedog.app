import { createHandler, renderAsync, StartServer } from "solid-start/entry-server";

import "dotenv/config";
import cloudinary from "cloudinary";
import { parseCookie, redirect } from "solid-start";
import { isAuthorizedRequest } from "./lib/auth";

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default createHandler(
  ({ forward }) => {
    return async (event) => {
      if (!isAuthorizedRequest(event.request)) {
        return redirect("/login");
      }

      return forward(event);
    };
  },
  renderAsync((event) => <StartServer event={event} />),
);
