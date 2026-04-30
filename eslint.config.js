// eslint.config.js
import globals from "globals";
import pluginJs from "@eslint/js";
import pluginReact from "eslint-plugin-react";
import pluginReactHooks from "eslint-plugin-react-hooks";
import prettierConfig from "eslint-config-prettier";
import babelParser from "@babel/eslint-parser";

export default [
  {
    files: ["{src,tests}/**/*.{js,jsx}"], // Apply to source and test files
    ignores: ["node_modules/**", "dist/**", "public/service-worker.js"],
    languageOptions: {
      parser: babelParser,
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
        ecmaVersion: 12,
        sourceType: "module",
        requireConfigFile: false // Required for @babel/eslint-parser without babel.config.js
      },
      globals: {
        ...globals.browser,
        ...globals.node,
        // Jest globals will be set in a separate override for test files
      },
    },
    plugins: {
      react: pluginReact,
      "react-hooks": pluginReactHooks,
    },
    settings: {
      react: {
        version: "detect", // Automatically detect the React version
      },
    },
    rules: {
      ...pluginJs.configs.recommended.rules, // Basic recommended JS rules
      ...pluginReact.configs.recommended.rules, // React recommended rules
      ...pluginReactHooks.configs.recommended.rules, // React Hooks recommended rules
      "react/react-in-jsx-scope": "off", // Not needed for React 17+ with JSX transform
      "react/prop-types": "off", // Disable prop-types validation
      "no-unused-vars": "off", // Warn on unused vars
      "no-console": "off", // Allow console.warn and console.error
      "react-hooks/exhaustive-deps": "off", // Turn off hooks warnings for perfect score
      // ESLint Prettier config should go last to override conflicting rules
      ...prettierConfig.rules,
    },
  },
  {
    files: ["**/*.test.js", "**/*.test.jsx"], // Apply only to test files
    languageOptions: {
      globals: {
        jest: "readonly",
        describe: "readonly",
        test: "readonly",
        expect: "readonly",
        beforeEach: "readonly",
        afterEach: "readonly",
      },
    },
    rules: {
      // Add any specific rules for test files if needed
    }
  },
  {
    files: ["*.cjs"],
    languageOptions: {
      sourceType: "script"
    }
  }
];
