import tsParser from "@typescript-eslint/parser";
import tsPlugin from "@typescript-eslint/eslint-plugin";
import unicorn from "eslint-plugin-unicorn";

export default [
  {
    files: ["src/**/*.ts"],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
      },
    },
    plugins: {
      "@typescript-eslint": tsPlugin,
      unicorn,
    },
    linterOptions: {
      noInlineConfig: true,
    },
    rules: {
      "no-console": "warn",

      "@typescript-eslint/no-unused-vars": "warn",
      "@typescript-eslint/no-explicit-any": "error",

      "unicorn/prefer-query-selector": "warn",
      "unicorn/prefer-dom-node-text-content": "warn",
      "unicorn/no-null": "off",
      "unicorn/prefer-node-protocol": "warn",
      "unicorn/prefer-modern-dom-apis": "warn",

      "@typescript-eslint/explicit-function-return-type": "off",
    },
  },
];
