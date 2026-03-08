import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import stylisticTs from '@stylistic/eslint-plugin-ts';

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
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
);
