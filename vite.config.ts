import { readFileSync } from "node:fs";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

const { config } = JSON.parse(
  readFileSync(new URL("./public/config.json", import.meta.url), "utf-8"),
);

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: { port: config.devServer.port, strictPort: true },
});
