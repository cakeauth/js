import json from "@rollup/plugin-json";
import terser from "@rollup/plugin-terser";
import typescript from "@rollup/plugin-typescript";
import analyze from "rollup-plugin-analyzer";

const external = ["fetch-retry", /node_modules/];

const typescriptPlugin = (format) =>
  typescript({
    tsconfig: "tsconfig.json",
    removeComments: true,
    outDir: `dist/${format}`,
    declarationDir: `dist/${format}/types`,
  });

const commonPlugins = (format) => [
  typescriptPlugin(format),
  terser({
    compress: {
      pure_getters: true,
      unsafe: true,
      unsafe_comps: true,
      drop_console: true,
    },
  }),
  json(),
  analyze({ summaryOnly: true }),
];

const commonConfig = {
  external,
  treeshake: {
    moduleSideEffects: false,
    propertyReadSideEffects: false,
    tryCatchDeoptimization: false,
  },
};

export default [
  {
    ...commonConfig,
    input: "src/index.ts",
    output: {
      dir: "dist/cjs",
      format: "cjs",
      exports: "named",
      sourcemap: true,
      preserveModules: true,
      entryFileNames: "[name].cjs",
      generatedCode: {
        constBindings: true,
      },
    },
    plugins: commonPlugins("cjs"),
  },
];
