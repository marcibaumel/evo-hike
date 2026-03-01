import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import pluginReact from 'eslint-plugin-react';
import { defineConfig } from 'eslint/config';

export default defineConfig([
    { files: ['**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'], plugins: { js }, extends: ['js/recommended'], languageOptions: { globals: globals.browser } },
    tseslint.configs.recommended,
    pluginReact.configs.flat.recommended,
    {
        settings: {
            react: {
                version: 'detect'
            }
        },
        rules: {
            // Code Quality & Best Practices
            'indent': ['error', 4],
            'semi': ['error', 'always'],
            'quotes': ['error', 'single', { 'avoidEscape': true }],
            'no-var': 'error',
            'prefer-const': 'error',
            'eqeqeq': ['error', 'always'],
            'no-console': 'warn',
            'no-debugger': 'error',
            'no-unused-vars': 'off', // TypeScript handles this

            // Code Clarity
            'comma-dangle': ['error', 'never'],
            'space-before-function-paren': ['error', { 'anonymous': 'always', 'named': 'never', 'asyncArrow': 'always' }],
            'keyword-spacing': 'error',
            'space-infix-ops': 'error',
            'space-before-blocks': 'error',
            'brace-style': ['error', '1tbs'],
            'no-trailing-spaces': 'error',

            // Error Prevention
            'no-eval': 'error',
            'no-with': 'error',
            'no-implicit-globals': 'error',
            'no-empty-function': 'warn',

            // React Specific
            'react/react-in-jsx-scope': 'off'
        }
    }
]);
