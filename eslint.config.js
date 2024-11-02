import globals from 'globals'
import pluginJs from '@eslint/js'
import stylistic from '@stylistic/eslint-plugin'
import tseslint from 'typescript-eslint'

export default [
  { files: ['**/*.{js,ts}'] },
  { ignores: ['**/dist/*'] },
  { languageOptions: { globals: { ...globals.browser, ...globals.node } } },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  stylistic.configs.recommended,
  {
    rules: {
      '@stylistic/generator-star-spacing': ['error', { before: true }],
    },
  },
  {
    rules: {
      '@typescript-eslint/no-unused-vars': 'off',
      '@typescript-eslint/no-empty-object-type': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
    },
  },
  {
    files: ['**/*.spec.{js,ts}', '**/test/*.{js,ts}'],
    rules: {
      '@typescript-eslint/no-unused-expressions': 'off',
    },
  },
]
