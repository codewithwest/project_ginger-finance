import { createDefaultPreset } from "ts-jest";

const tsJestTransformCfg = createDefaultPreset().transform;

/** @type {import("jest").Config} **/
export const testEnvironment = "node";
export const transform = {
  ...tsJestTransformCfg,
};
export const testMatch = ["**/tests/**/*.test.ts"];
export const moduleFileExtensions = ["ts", "js", "json"];
export const globals = {
  "ts-jest": {
    tsconfig: "./tsconfig.json",
  },
};