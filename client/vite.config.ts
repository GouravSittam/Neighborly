import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "node:path";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "./src"),
    },
  },
  server: {
    proxy: {
      "/api": "http://localhost:4000",
    },
  },
  build: {
    rolldownOptions: {
      output: {
        // Long-lived vendor chunks so app changes don't bust the framework cache.
        codeSplitting: {
          groups: [
            { name: "react", test: /node_modules[\\/](react|react-dom|scheduler|react-router)[\\/]/ },
            { name: "motion", test: /node_modules[\\/](motion|motion-dom|motion-utils|framer-motion)[\\/]/ },
            { name: "charts", test: /node_modules[\\/](recharts|d3-[a-z-]+|victory-vendor|@reduxjs|immer|reselect)[\\/]/ },
          ],
        },
      },
    },
  },
});
