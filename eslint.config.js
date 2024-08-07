import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";


export default [
  {files: ['**/*.{js,ts}']},
  {ignores: ['**/dist/*']},
  {languageOptions: { globals: {...globals.browser, ...globals.node} }},
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  {
    rules: {
      '@typescript-eslint/no-unused-vars': 'off',
      '@typescript-eslint/no-empty-object-type': 'off',
      '@typescript-eslint/no-explicit-any': 'off'
    }
  },
  {
    files: ['**/*.spec.{js,ts}', '**/test/*.{js,ts}'],
    rules: {
      '@typescript-eslint/no-unused-expressions': 'off'
    }
  }
];
