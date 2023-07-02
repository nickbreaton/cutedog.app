import {
  createHandler,
  renderAsync,
  StartServer,
} from "solid-start/entry-server";

import "dotenv/config";

export default createHandler(
  renderAsync((event) => <StartServer event={event} />)
);
