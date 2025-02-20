import react from "@vitejs/plugin-react";
import { resolve } from "path";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";
import { libInjectCss } from "vite-plugin-lib-inject-css";

export default defineConfig({
  plugins: [
    react(),
    libInjectCss(),
    dts({
      tsconfigPath: resolve(__dirname, "tsconfig.lib.json"),
    }),
  ],
  build: {
    copyPublicDir: false,
    lib: {
      entry: {
        index: resolve(__dirname, "lib/index.ts"),
        "hooks/index": resolve(__dirname, "lib/hooks/index.ts"),
        "components/index": resolve(__dirname, "lib/components/index.ts"),
        "functions/index": resolve(__dirname, "lib/functions/index.ts"),
      },
      formats: ["es"],
    },
    rollupOptions: {
      external: [
        "react",
        "react-dom",
        "react/jsx-runtime",
        /^react\/.*/, // This ensures all React submodules are externalized
      ],
      output: {
        assetFileNames: "assets/[name][extname]",
        entryFileNames: "[name].js",
        preserveModules: true,
        preserveModulesRoot: "lib",
        banner: (chunk) => {
          if (
            chunk.fileName.includes("hooks/") ||
            chunk.fileName.includes("components/") ||
            chunk.fileName === "index.js"
          ) {
            return '"use client";';
          }
          return "";
        },
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
          "react/jsx-runtime": "jsx",
        },
      },
    },
  },
});
