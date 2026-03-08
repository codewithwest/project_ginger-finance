import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import stylisticTs from '@stylistic/eslint-plugin-ts';

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
  {
    plugins: {
      '@stylistic/ts': stylisticTs,
    },
    rules: {
      'id-length': ['error', {
        min: 3,
        exceptions: ['_', 'id', 'ex', 'db'],
        properties: 'never'
      }],
      '@stylistic/ts/padding-line-between-statements': [
        'error',
        { blankLine: 'always', prev: '*', next: 'return' }
      ]
    }
  }
]);

export default eslintConfig;
