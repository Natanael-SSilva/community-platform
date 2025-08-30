import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";
import { defineConfig } from "eslint/config";

export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
    plugins: { js },
    extends: ["js/recommended"],
    languageOptions: { globals: globals.browser },

    // ADICIONAMOS A CHAVE 'rules' AQUI
    rules: {
      // Desliga permanentemente a regra que proíbe o uso de 'require()'.
      "@typescript-eslint/no-require-imports": "off",
      // Desliga a regra que exige que React esteja no escopo para JSX.
      "react/react-in-jsx-scope": "off",
    },
  },
  tseslint.configs.recommended,
  pluginReact.configs.flat.recommended,
  {
    settings: {
      react: {
        version: "detect",
      },
    },
  },
]);