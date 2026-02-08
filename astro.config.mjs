// @ts-check
import { defineConfig } from "astro/config";

import vercel from "@astrojs/vercel";
import react from "@astrojs/react";
import clerk from "@clerk/astro";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  integrations: [react(), clerk()],

  vite: {
    // @ts-ignore
    plugins: [tailwindcss()],
  },

  server: {
    port: 7878,
  },
  adapter: vercel(),
  output: "server",
});
