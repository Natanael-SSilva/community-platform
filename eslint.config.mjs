import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";
import { defineConfig } from "eslint/config";

export default defineConfig([
  // Configuração base para todos os arquivos
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
    rules: {
      "react/react-in-jsx-scope": "off",
    },
  },

  // Configurações recomendadas para TypeScript
  ...tseslint.configs.recommended,

  // Configurações recomendadas para React
  pluginReact.configs.flat.recommended,

  // Configurações globais do plugin React
  {
    settings: {
      react: {
        version: "detect",
      },
    },
  },

  // NOSSO BLOCO FINAL E ESPECÍFICO DE REGRAS
  // Este bloco terá a prioridade final para arquivos TypeScript
  {
    files: ["**/*.{ts,tsx}"],
    rules: {
      "@typescript-eslint/no-require-imports": "off",
    },
  },
]);