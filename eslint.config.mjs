import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import pluginWorkspaces from "eslint-plugin-workspaces";

/** @type {import('eslint').Linter.Config[]} */
export default [
  { files: ["**/*.ts"] },
  { languageOptions: { globals: globals.browser } },
  {
    ignores: ["**/jest.config.js", "**/build/", "**/dist/", "**/node_modules/"],
  },
  pluginJs.configs.recommended,
  {
    plugins: {
      workspaces: pluginWorkspaces.configs.recommended,
    },
  },
  ...tseslint.configs.recommended,
];
