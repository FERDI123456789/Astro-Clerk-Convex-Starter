// @ts-check
import { defineConfig } from "astro/config";

import node from "@astrojs/node";

import react from "@astrojs/react";

import clerk from "@clerk/astro";

import tailwindcss from "@tailwindcss/vite";

// https://astro.build/config
export default defineConfig({
  adapter: node({
    mode: "standalone",
  }),

  integrations: [react(), clerk()],

  vite: {
    // @ts-ignore
    plugins: [tailwindcss()],
  },
  server: { port: 7878 },
  output: "server",
});
