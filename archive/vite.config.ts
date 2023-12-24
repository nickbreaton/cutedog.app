import solid from "solid-start/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

import vercel from "solid-start-vercel";

export default defineConfig({
  plugins: [tsconfigPaths(), solid({ adapter: vercel({}) })],
});
