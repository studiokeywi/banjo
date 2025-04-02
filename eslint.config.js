import eslint from '@eslint/js';
import tslint from 'typescript-eslint';

const config = tslint.config(eslint.configs.recommended, ...tslint.configs.strictTypeChecked, ...tslint.configs.stylisticTypeChecked, {
  languageOptions: { parserOptions: { project: true, tsconfigRootDir: import.meta.dirname } },
  rules: {
    '@typescript-eslint/no-inferrable-types': 'off',
    '@typescript-eslint/no-non-null-assertion': 'off',
    '@typescript-eslint/restrict-template-expressions': [
      'error',
      {
        allow: [
          { name: ['Error', 'URL', 'URLSearchParams'], from: 'lib' },
          { name: ['Chrono'], from: 'file', path: './lib/chrono.ts' },
        ],
        allowAny: false,
        allowArray: false,
        allowBoolean: true,
        allowNever: false,
        allowNullish: false,
        allowNumber: true,
        allowRegExp: false,
      },
    ],
  },
});

export default config;
