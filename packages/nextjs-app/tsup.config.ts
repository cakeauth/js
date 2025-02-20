import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["lib/index.ts"],
  format: ["cjs", "esm"],
  dts: true,
  splitting: true,
  sourcemap: true,
  clean: true,
  external: ["react", "next", "@cakeauth/react"],
  tsconfig: "tsconfig.lib.json",
});
