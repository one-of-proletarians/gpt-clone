import path from "path";
import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vite";
import { TanStackRouterVite } from "@tanstack/router-vite-plugin";
import prismjs from "vite-plugin-prismjs";

export default defineConfig({
  plugins: [
    react(),
    TanStackRouterVite(),
    prismjs({
      languages: "all",
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
