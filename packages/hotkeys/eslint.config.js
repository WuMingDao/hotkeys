// @ts-check

import rootConfig from '../../eslint.config.js'

/** @type {import('eslint').Linter.Config[]} */
export default [
  ...rootConfig,
  {
    rules: {},
  },
  {
    files: ['tests/**/*.ts'],
    languageOptions: {
      globals: {
        KeyboardEvent: 'readonly',
        document: 'readonly',
        window: 'readonly',
        Event: 'readonly',
        EventTarget: 'readonly',
      },
    },
  },
]
