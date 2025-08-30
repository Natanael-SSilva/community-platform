// REMOVEMOS os imports de 'js' e 'globals' que não eram usados.
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

  // Bloco final e específico de regras para TypeScript
  {
    files: ["**/*.{ts,tsx}"],
    rules: {
      "@typescript-eslint/no-require-imports": "off",
    },
  },
]);